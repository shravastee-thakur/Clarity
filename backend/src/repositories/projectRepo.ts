import Project, { IProject } from "../models/projectModel.js";
import { HydratedDocument } from "mongoose";

export type ProjectDocument = HydratedDocument<IProject>;
export type CreateProjectInput = Pick<
  IProject,
  "name" | "description" | "workspace" | "createdBy" | "startDate" | "endDate"
>;

export const createProject = async (
  data: CreateProjectInput,
): Promise<ProjectDocument> => {
  return Project.create(data);
};

export const findProjectsByWorkspace = async (
  workspaceId: string,
): Promise<ProjectDocument[]> => {
  return Project.find({ workspace: workspaceId, status: "active" }).exec();
};
