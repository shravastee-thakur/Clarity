import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/userModel.js";
import Workspace from "../../src/models/workspaceModel.js";
import WorkspaceMember from "../../src/models/workspaceMemberModel.js";
import Project from "../../src/models/projectModel.js";
import { generateAccessToken } from "../../src/utils/jwt.js";

describe("Project Routes: Tenant Isolation and Role Checks", () => {
  let adminA: any;
  let memberA: any;
  let workspaceA: any;
  let workspaceB: any;
  let projectB: any;
  let tokenAdminA: string;
  let tokenMemberA: string;

  beforeEach(async () => {
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
    const adminB = await User.create({
      name: "Admin B",
      email: "adminB@test.com",
      password: "pass",
      authProvider: "local",
      isVerified: true,
    });

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

    projectB = await Project.create({
      name: "Project B",
      workspace: workspaceB._id,
      createdBy: adminB._id,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
    });

    tokenAdminA = generateAccessToken({ id: adminA._id.toString() });
    tokenMemberA = generateAccessToken({ id: memberA._id.toString() });
  });

  it("allows an admin to create a project in their workspace", async () => {
    const res = await request(app)
      .post(`/api/v1/workspaces/${workspaceA._id}/projects`)
      .set("Authorization", `Bearer ${tokenAdminA}`)
      .send({
        name: "New Project A",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("New Project A");
  });

  it("rejects project creation if end date is before start date", async () => {
    const res = await request(app)
      .post(`/api/v1/workspaces/${workspaceA._id}/projects`)
      .set("Authorization", `Bearer ${tokenAdminA}`)
      .send({
        name: "Bad Dates",
        startDate: "2024-12-31",
        endDate: "2024-01-01",
      });

    expect(res.status).toBe(400);
  });

  it("DENIES a standard member from creating a project", async () => {
    const res = await request(app)
      .post(`/api/v1/workspaces/${workspaceA._id}/projects`)
      .set("Authorization", `Bearer ${tokenMemberA}`)
      .send({
        name: "Member Project",
        startDate: "2024-01-01",
        endDate: "2024-12-31",
      });

    expect(res.status).toBe(403);
  });

  it("DENIES Admin A from updating a project that belongs to Workspace B (IDOR Vulnerability Test)", async () => {
    // Admin A uses their valid token for Workspace A
    // But they pass Workspace A's ID in the URL, and Project B's ID in the URL
    const res = await request(app)
      .patch(`/api/v1/workspaces/${workspaceA._id}/projects/${projectB._id}`)
      .set("Authorization", `Bearer ${tokenAdminA}`)
      .send({ name: "Hacked Project B" });

    // This MUST fail. If it returns 200, Admin A just hijacked Workspace B's data.
    expect([403, 404]).toContain(res.status);

    // Gray box: Prove Project B's name did NOT change in the database
    const dbProjectB = await Project.findById(projectB._id);
    expect(dbProjectB?.name).toBe("Project B");
  });
});
