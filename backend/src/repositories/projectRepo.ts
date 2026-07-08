import Project, { IProject } from "../models/projectModel.js";
import { HydratedDocument, Types } from "mongoose";

export type ProjectDocument = HydratedDocument<IProject>;
export type CreateProjectInput = Pick<
  IProject,
  "name" | "description" | "workspace" | "createdBy" | "startDate" | "endDate"
>;

export interface ProjectWithStats {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  workspace: Types.ObjectId;
  createdBy: Types.ObjectId;
  status: string;
  startDate: Date;
  endDate: Date;
  totalTasks: number;
  completedTasks: number;
}

export const createProject = async (
  data: CreateProjectInput,
): Promise<ProjectDocument> => {
  return Project.create(data);
};

// Aggregation pipeline to fetch projects with task statistics

export const findProjectsByWorkspaceWithStats = async (
  workspaceId: string,
): Promise<ProjectWithStats[]> => {
  return Project.aggregate([
    {
      $match: { workspace: new Types.ObjectId(workspaceId), status: "active" },
    },
    {
      $lookup: {
        from: "tasks",
        let: { projectId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$project", "$$projectId"] } } },
          {
            $group: {
              _id: null,
              totalTasks: { $sum: 1 },
              completedTasks: {
                $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
              },
            },
          },
        ],
        as: "taskStats",
      },
    },
    {
      $addFields: {
        totalTasks: {
          $ifNull: [{ $arrayElemAt: ["$taskStats.totalTasks", 0] }, 0],
        },
        completedTasks: {
          $ifNull: [{ $arrayElemAt: ["$taskStats.completedTasks", 0] }, 0],
        },
      },
    },
    { $project: { taskStats: 0 } },
  ]);
};
