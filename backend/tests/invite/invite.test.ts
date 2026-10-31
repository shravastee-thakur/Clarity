import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/userModel.js";
import Workspace from "../../src/models/workspaceModel.js";
import WorkspaceMember from "../../src/models/workspaceMemberModel.js";
import Invite from "../../src/models/inviteModel.js";
import { generateAccessToken } from "../../src/utils/jwt.js";


const { emailMocks } = vi.hoisted(() => ({
  emailMocks: {
    sendLoginOtpEmail: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    sendMagicLoginEmail: vi.fn(),
    sendWorkspaceInviteEmail: vi.fn(),
  },
}));

vi.mock("../../src/services/emailService.js", () => emailMocks);

vi.mock("../../src/middlewares/securityMiddleware.js", () => ({
  securityMiddleware: (req: any, res: any, next: any) => next(),
}));

vi.mock("../../src/middlewares/rateLimiter.js", () => ({
  rateLimiterMiddleware: () => (req: any, res: any, next: any) => next(),
}));

describe("Invite Flow: Security and Tenant Isolation", () => {
  let adminA: any;
  let memberA: any;
  let adminB: any;
  let workspaceA: any;
  let workspaceB: any;
  let tokenAdminA: string;
  let tokenMemberA: string;
  let tokenAdminB: string;

  beforeEach(async () => {
    // Seed Users
    adminA = await User.create({
      name: "Admin A",
      email: "adminA@test.com",
      password: "pass",
      authProvider: "local",
      isVerified: true,
    });
    memberA = await User.create({
      name: "Member A",
      email: "memberA@test.com",
      password: "pass",
      authProvider: "local",
      isVerified: true,
    });
    adminB = await User.create({
      name: "Admin B",
      email: "adminB@test.com",
      password: "pass",
      authProvider: "local",
      isVerified: true,
    });

    // Seed Workspaces
    workspaceA = await Workspace.create({
      name: "Workspace A",
      slug: "ws-a",
      owner: adminA._id,
    });
    workspaceB = await Workspace.create({
      name: "Workspace B",
      slug: "ws-b",
      owner: adminB._id,
    });

    // Seed Memberships
    await WorkspaceMember.create({
      workspace: workspaceA._id,
      user: adminA._id,
      role: "admin",
    });
    await WorkspaceMember.create({
      workspace: workspaceA._id,
      user: memberA._id,
      role: "member",
    });
    await WorkspaceMember.create({
      workspace: workspaceB._id,
      user: adminB._id,
      role: "admin",
    });

    // Forge Tokens
    tokenAdminA = generateAccessToken({ id: adminA._id.toString() });
    tokenMemberA = generateAccessToken({ id: memberA._id.toString() });
    tokenAdminB = generateAccessToken({ id: adminB._id.toString() });

    emailMocks.sendWorkspaceInviteEmail.mockClear();
  });

  it("sends an invite, accepts it, creates the user, and strictly assigns the 'member' role", async () => {
    // 1. Admin A sends invite to a brand new email
    const sendRes = await request(app)
      .post(`/api/v1/workspaces/${workspaceA._id}/invites`)
      .set("Authorization", `Bearer ${tokenAdminA}`)
      .send({ email: "newguy@test.com" });

    expect(sendRes.status).toBe(200);
    expect(emailMocks.sendWorkspaceInviteEmail).toHaveBeenCalledOnce();

    // Intercept the magic token
    const capturedToken = emailMocks.sendWorkspaceInviteEmail.mock.calls[0][1];

    // 2. New guy accepts the invite
    const acceptRes = await request(app)
      .post("/api/v1/invites/accept")
      .send({ token: capturedToken });

    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.message).toContain("accepted");

    // 3. Gray Box: Prove the Account Paradox worked and role is strictly 'member'
    const newUser = await User.findOne({ email: "newguy@test.com" });
    expect(newUser).not.toBeNull();
    expect(newUser?.authProvider).toBe("magic");

    const membership = await WorkspaceMember.findOne({
      workspace: workspaceA._id,
      user: newUser?._id,
    });
    expect(membership).not.toBeNull();
    expect(membership?.role).toBe("member"); // Privilege escalation prevented

    // 4. Gray Box: Prove the invite was consumed
    const inviteRecord = await Invite.findOne({ email: "newguy@test.com" });
    expect(inviteRecord?.status).toBe("accepted");
  });

  it("rejects a second attempt to use the exact same invite token (Double Use Prevention)", async () => {
    // Send and capture token
    await request(app)
      .post(`/api/v1/workspaces/${workspaceA._id}/invites`)
      .set("Authorization", `Bearer ${tokenAdminA}`)
      .send({ email: "doubleuse@test.com" });

    const capturedToken = emailMocks.sendWorkspaceInviteEmail.mock.calls[0][1];

    // First use succeeds
    await request(app)
      .post("/api/v1/invites/accept")
      .send({ token: capturedToken });

    // Second use MUST fail
    const secondAttempt = await request(app)
      .post("/api/v1/invites/accept")
      .send({ token: capturedToken });

    expect(secondAttempt.status).toBe(400);
    expect(secondAttempt.body.message).toContain("already been used");
  });

  it("DENIES a standard member from sending invites (Permission Check)", async () => {
    const res = await request(app)
      .post(`/api/v1/workspaces/${workspaceA._id}/invites`)
      .set("Authorization", `Bearer ${tokenMemberA}`)
      .send({ email: "intruder@test.com" });

    expect(res.status).toBe(403);
  });

  it("DENIES Admin A from revoking an invite that belongs to Workspace B (Tenant Isolation)", async () => {
    // Admin B sends an invite in Workspace B

    await request(app)
      .post(`/api/v1/workspaces/${workspaceB._id}/invites`)
      .set("Authorization", `Bearer ${tokenAdminB}`)
      .send({ email: "target@test.com" });

    // Grab the invite ID from Workspace B
    const wsBInvite = await Invite.findOne({ workspaceId: workspaceB._id });

    // Admin A tries to delete Workspace B's invite
    const res = await request(app)
      .delete(`/api/v1/workspaces/${workspaceB._id}/invites/${wsBInvite?._id}`)
      .set("Authorization", `Bearer ${tokenAdminA}`);

    expect(res.status).toBe(403);
  });
});
