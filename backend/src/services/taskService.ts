import * as taskRepo from "../repositories/taskRepo.js";
import * as workspaceRepo from "../repositories/workspaceRepo.js";
import { TaskDocument } from "../repositories/taskRepo.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";

export interface TaskDto {
  _id: string;
  title: string;
  description?: string;
  project: {
    _id: string;
    name: string;
  };
  workspace: string;
  assignee: string;
  createdBy: string;
  status: string;
  priority: string;
  dueDate: Date;
}

export interface AdminStatsDto {
  openTasks: number;
  completedToday: number;
  topBottleneckUserId: string | null;
  topBottleneckTaskCount: number;
}

const mapToTaskDto = (task: TaskDocument): TaskDto => {
  const obj = task.toObject();
  const projectData = obj.project as any;
  return {
    _id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    project: {
      _id: projectData._id.toString(),
      name: projectData.name,
    },
    workspace: obj.workspace.toString(),
    assignee: obj.assignee.toString(),
    createdBy: obj.createdBy.toString(),
    status: obj.status,
    priority: obj.priority,
    dueDate: obj.dueDate,
  };
};

export const assignTask = async (
  userId: string,
  workspaceId: string,
  data: any,
): Promise<TaskDto> => {
  const member = await workspaceRepo.findWorkspaceMember(workspaceId, userId);
  if (!member || member.role !== "admin") {
    throw new ApiError(403, "Only workspace admins can assign tasks");
  }

  const assigneeMember = await workspaceRepo.findWorkspaceMember(
    workspaceId,
    data.assigneeId,
  );
  if (!assigneeMember)
    throw new ApiError(400, "Assignee is not a member of this workspace");

  const task = await taskRepo.createTask({
    title: data.title,
    description: data.description,
    project: data.projectId,
    workspace: new mongoose.Types.ObjectId(workspaceId),
    assignee: data.assigneeId,
    createdBy: new mongoose.Types.ObjectId(userId),
    priority: data.priority,
    dueDate: data.dueDate,
  });

  return mapToTaskDto(task);
};

export const getProjectTasks = async (
  userId: string,
  workspaceId: string,
  projectId: string,
): Promise<TaskDto[]> => {
  const member = await workspaceRepo.findWorkspaceMember(workspaceId, userId);
  if (!member)
    throw new ApiError(403, "You are not a member of this workspace");

  const tasks = await taskRepo.findTasksByProject(projectId);
  return tasks.map(mapToTaskDto);
};

export const getMyTasks = async (
  userId: string,
  workspaceId: string,
): Promise<TaskDto[]> => {
  const member = await workspaceRepo.findWorkspaceMember(workspaceId, userId);
  if (!member)
    throw new ApiError(403, "You are not a member of this workspace");

  const tasks = await taskRepo.findTasksByAssignee(userId, workspaceId);
  return tasks.map(mapToTaskDto);
};

export const getAdminDashboardStats = async (
  userId: string,
  workspaceId: string,
): Promise<AdminStatsDto> => {
  const member = await workspaceRepo.findWorkspaceMember(workspaceId, userId);
  if (!member || member.role !== "admin") {
    throw new ApiError(403, "Only workspace admins can view macro metrics");
  }

  const rawStats = await taskRepo.getWorkspaceStats(workspaceId);

  return {
    openTasks: rawStats.openTasks[0]?.count || 0,
    completedToday: rawStats.completedToday[0]?.count || 0,
    topBottleneckUserId: rawStats.bottlenecks[0]?._id.toString() || null,
    topBottleneckTaskCount: rawStats.bottlenecks[0]?.totalCount || 0,
  };
};

export const getEmployeeFocusTasks = async (
  userId: string,
  workspaceId: string,
): Promise<TaskDto[]> => {
  const member = await workspaceRepo.findWorkspaceMember(workspaceId, userId);
  if (!member) {
    throw new ApiError(403, "You are not a member of this workspace");
  }

  const tasks = await taskRepo.findFocusTasks(userId, workspaceId);
  return tasks.map(mapToTaskDto);
};

export const reportTaskBlocker = async (
  userId: string,
  workspaceId: string,
  taskId: string,
): Promise<TaskDto> => {
  const member = await workspaceRepo.findWorkspaceMember(workspaceId, userId);
  if (!member) {
    throw new ApiError(403, "You are not a member of this workspace");
  }

  const task = await taskRepo.markTaskAsBlocked(taskId, userId);
  if (!task) {
    throw new ApiError(404, "Task not found or you are not the assignee");
  }

  return mapToTaskDto(task);
};
