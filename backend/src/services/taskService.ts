import * as taskRepo from "../repositories/taskRepo.js";
import * as workspaceRepo from "../repositories/workspaceRepo.js";
import { TaskDocument } from "../repositories/taskRepo.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";

export interface TaskDto {
  _id: string;
  title: string;
  description?: string;
  project: string;
  workspace: string;
  assignee: string;
  createdBy: string;
  status: string;
  priority: string;
  dueDate: Date;
}

const mapToTaskDto = (task: TaskDocument): TaskDto => {
  const obj = task.toObject();
  return {
    _id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    project: obj.project.toString(),
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
  if (!member)
    throw new ApiError(403, "You are not a member of this workspace");

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
