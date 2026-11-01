import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/userModel.js";
import Workspace from "../../src/models/workspaceModel.js";
import WorkspaceMember from "../../src/models/workspaceMemberModel.js";
import Project from "../../src/models/projectModel.js";
import Task from "../../src/models/taskModel.js";
import { generateAccessToken } from "../../src/utils/jwt.js";

describe("Task Routes: Role Checks and Tenant Isolation", () => {
  let adminA: any;
  let memberA: any;
  let adminB: any;
  let workspaceA: any;
  let workspaceB: any;
  let projectA: any;
  let taskA: any;
  let tokenAdminA: string;
  let tokenMemberA: string;
  let tokenAdminB: string;

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
    adminB = await User.create({
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

    projectA = await Project.create({
      name: "Project A",
      workspace: workspaceA._id,
      createdBy: adminA._id,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
    });

    taskA = await Task.create({
      title: "Task A",
      project: projectA._id,
      workspace: workspaceA._id,
      assignee: memberA._id,
      createdBy: adminA._id,
      dueDate: new Date("2024-12-31"),
    });

    tokenAdminA = generateAccessToken({ id: adminA._id.toString() });
    tokenMemberA = generateAccessToken({ id: memberA._id.toString() });
    tokenAdminB = generateAccessToken({ id: adminB._id.toString() });
  });

  it("allows an admin to assign a task to a valid workspace member", async () => {
    const res = await request(app)
      .post(`/api/v1/workspaces/${workspaceA._id}/tasks`)
      .set("Authorization", `Bearer ${tokenAdminA}`)
      .send({
        title: "New Task",
        projectId: projectA._id.toString(),
        assigneeId: memberA._id.toString(),
        priority: "high",
        dueDate: "2024-12-31",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("New Task");
    expect(res.body.data.assignee._id).toBe(memberA._id.toString());
  });

  it("DENIES an admin from assigning a task to a non-member", async () => {
    const res = await request(app)
      .post(`/api/v1/workspaces/${workspaceA._id}/tasks`)
      .set("Authorization", `Bearer ${tokenAdminA}`)
      .send({
        title: "Invalid Assignee Task",
        projectId: projectA._id.toString(),
        assigneeId: adminB._id.toString(), // adminB is not in workspaceA
        priority: "high",
        dueDate: "2024-12-31",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("not a member");
  });

  it("DENIES a standard member from assigning tasks", async () => {
    const res = await request(app)
      .post(`/api/v1/workspaces/${workspaceA._id}/tasks`)
      .set("Authorization", `Bearer ${tokenMemberA}`)
      .send({
        title: "Member Task",
        projectId: projectA._id.toString(),
        assigneeId: memberA._id.toString(),
        priority: "high",
        dueDate: "2024-12-31",
      });

    expect(res.status).toBe(403);
  });

  it("allows an assignee to update the status of their own task", async () => {
    const res = await request(app)
      .patch(`/api/v1/workspaces/${workspaceA._id}/tasks/${taskA._id}`)
      .set("Authorization", `Bearer ${tokenMemberA}`)
      .send({ status: "in_progress" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("in_progress");
  });

  it("DENIES an assignee from updating the title or assignee of their task", async () => {
    const res = await request(app)
      .patch(`/api/v1/workspaces/${workspaceA._id}/tasks/${taskA._id}`)
      .set("Authorization", `Bearer ${tokenMemberA}`)
      .send({ title: "Hacked Title", assigneeId: adminA._id.toString() });

    // The service ignores title/assigneeId for non-admins.
    // If no valid fields remain, it throws a 400.
    expect(res.status).toBe(400);
    expect(res.body.message).toContain("No valid fields");
  });

  it("DENIES a non-assignee member from updating a task", async () => {
    const memberC = await User.create({
      name: "Member C",
      email: "memberC@test.com",
      password: "pass",
      authProvider: "local",
      isVerified: true,
    });
    await WorkspaceMember.create({
      workspace: workspaceA._id,
      user: memberC._id,
      role: "member",
    });
    const tokenMemberC = generateAccessToken({ id: memberC._id.toString() });

    const res = await request(app)
      .patch(`/api/v1/workspaces/${workspaceA._id}/tasks/${taskA._id}`)
      .set("Authorization", `Bearer ${tokenMemberC}`)
      .send({ status: "done" });

    expect(res.status).toBe(403);
  });

  it("DENIES Admin B from updating a task in Workspace A (IDOR Prevention)", async () => {
    const res = await request(app)
      .patch(`/api/v1/workspaces/${workspaceB._id}/tasks/${taskA._id}`)
      .set("Authorization", `Bearer ${tokenAdminB}`)
      .send({ status: "done" });

    expect(res.status).toBe(403);
  });
});
