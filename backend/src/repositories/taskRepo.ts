import Task, { ITask } from "../models/taskModel.js";
import { HydratedDocument } from "mongoose";

export type TaskDocument = HydratedDocument<ITask>;
export type CreateTaskInput = Pick<
  ITask,
  | "title"
  | "description"
  | "project"
  | "workspace"
  | "assignee"
  | "createdBy"
  | "priority"
  | "dueDate"
>;

export const createTask = async (
  data: CreateTaskInput,
): Promise<TaskDocument> => {
  return Task.create(data);
};

export const findTasksByAssignee = async (
  userId: string,
  workspaceId: string,
): Promise<TaskDocument[]> => {
  return Task.find({
    assignee: userId,
    workspace: workspaceId,
    status: { $ne: "done" },
  })
    .sort({ dueDate: 1 })
    .exec();
};
