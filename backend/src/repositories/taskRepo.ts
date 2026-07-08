import Task, { ITask } from "../models/taskModel.js";
import { HydratedDocument, Types } from "mongoose";

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
  const task = await Task.create(data);

  const populatedTask = await Task.findById(task._id)
    .populate({ path: "project", select: "name" })
    .populate({ path: "assignee", select: "name email" })
    .exec();

  return populatedTask as TaskDocument;
};

export const findTaskById = async (
  taskId: string,
): Promise<TaskDocument | null> => {
  return Task.findById(new Types.ObjectId(taskId)).exec();
};

export const updateTaskById = async (
  taskId: string,
  data: Partial<ITask>,
): Promise<TaskDocument | null> => {
  return Task.findByIdAndUpdate(new Types.ObjectId(taskId), data, { new: true })
    .populate({ path: "project", select: "name" })
    .populate({ path: "assignee", select: "name email" })
    .exec();
};

export const findTasksByProject = async (
  projectId: string,
): Promise<TaskDocument[]> => {
  return Task.find({ project: projectId })
    .populate({ path: "project", select: "name" })
    .populate({ path: "assignee", select: "name email" })
    .sort({ dueDate: 1 })
    .exec();
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
    .populate({ path: "project", select: "name" })
    .populate({ path: "assignee", select: "name email" })
    .sort({ dueDate: 1 })
    .exec();
};

// Admin Macro Metrics Pipeline
export const getWorkspaceStats = async (workspaceId: string) => {
  const workspaceObjectId = new Types.ObjectId(workspaceId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await Task.aggregate([
    { $match: { workspace: workspaceObjectId } },
    {
      $facet: {
        openTasks: [
          { $match: { status: { $ne: "done" } } },
          { $count: "count" },
        ],
        completedToday: [
          {
            $match: {
              status: "done",
              updatedAt: { $gte: today },
            },
          },
          { $count: "count" },
        ],
        bottlenecks: [
          { $match: { status: { $ne: "done" } } },
          {
            $group: {
              _id: "$assignee",
              highPriorityCount: {
                $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
              },
              totalCount: { $sum: 1 },
            },
          },
          { $sort: { highPriorityCount: -1 } },
          { $limit: 1 },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          {
            $unwind: {
              path: "$userDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
  ]);
  return stats[0];
};

// Employee Micro Execution Query
export const findFocusTasks = async (userId: string, workspaceId: string) => {
  return Task.find({
    assignee: new Types.ObjectId(userId),
    workspace: new Types.ObjectId(workspaceId),
    status: { $in: ["todo", "in_progress"] },
  })
    .populate({ path: "project", select: "name" })
    .populate({ path: "assignee", select: "name email" })
    .sort({ priority: -1, dueDate: 1 })
    .limit(3)
    .exec();
};

// Blocker Action
export const markTaskAsBlocked = async (taskId: string, userId: string) => {
  return Task.findOneAndUpdate(
    { _id: new Types.ObjectId(taskId), assignee: new Types.ObjectId(userId) },
    { status: "blocked" },
    { new: true },
  )
    .populate({ path: "assignee", select: "name email" })
    .populate({ path: "project", select: "name" })
    .exec();
};
