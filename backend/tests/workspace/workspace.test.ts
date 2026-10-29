import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/userModel.js";
import Workspace from "../../src/models/workspaceModel.js";
import WorkspaceMember from "../../src/models/workspaceMemberModel.js";
import { generateAccessToken } from "../../src/utils/jwt.js";

describe("Workspace Routes: Tenant Isolation", () => {
  let userA: any;
  let userB: any;
  let tokenA: string;
  let tokenB: string;
  let workspaceA: any;

  beforeEach(async () => {
    userA = await User.create({
      name: "User A",
      email: "userA@example.com",
      password: "password123",
      isVerified: true,
      authProvider: "local",
    });

    userB = await User.create({
      name: "User B",
      email: "userB@example.com",
      password: "password123",
      isVerified: true,
      authProvider: "local",
    });

    tokenA = generateAccessToken({ id: userA._id.toString() });
    tokenB = generateAccessToken({ id: userB._id.toString() });

    workspaceA = await Workspace.create({
      name: "Workspace A",
      slug: "workspace-a",
      owner: userA._id,
    });

    await WorkspaceMember.create({
      workspace: workspaceA._id,
      user: userA._id,
      role: "admin",
    });
  });

  describe("POST /api/v1/workspaces (Create Workspace)", () => {
    it("allows a user to create their first workspace", async () => {
      const res = await request(app)
        .post("/api/v1/workspaces")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({ name: "Workspace B", slug: "workspace-b" });

      expect(res.status).toBe(201);
      expect(res.body.data.owner).toBe(userB._id.toString());
    });

    it("rejects creating a second workspace for the same owner", async () => {
      const res = await request(app)
        .post("/api/v1/workspaces")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ name: "Workspace A2", slug: "workspace-a2" });

      expect(res.status).toBe(409);
    });

    it("rejects creating a workspace with an existing slug", async () => {
      const res = await request(app)
        .post("/api/v1/workspaces")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({ name: "Workspace Copy", slug: "workspace-a" });

      expect(res.status).toBe(409);
    });
  });

  describe("GET /api/v1/workspaces/:workspaceId (Get Workspace)", () => {
    it("allows a member to read their own workspace", async () => {
      const res = await request(app)
        .get(`/api/v1/workspaces/${workspaceA._id}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.data.slug).toBe("workspace-a");
    });

    it("DENIES access to a non-member (Tenant Isolation)", async () => {
      const res = await request(app)
        .get(`/api/v1/workspaces/${workspaceA._id}`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/v1/workspaces/:workspaceId/members (Get Members)", () => {
    it("allows a member to read the member list", async () => {
      const res = await request(app)
        .get(`/api/v1/workspaces/${workspaceA._id}/members`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it("DENIES access to a non-member (Tenant Isolation)", async () => {
      const res = await request(app)
        .get(`/api/v1/workspaces/${workspaceA._id}/members`)
        .set("Authorization", `Bearer ${tokenB}`);

      expect(res.status).toBe(403);
    });
  });
});
