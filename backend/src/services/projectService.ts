import * as projectRepo from "../repositories/projectRepo.js";
import * as workspaceRepo from "../repositories/workspaceRepo.js";
import { ProjectDocument } from "../repositories/projectRepo.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";
import { CreateProjectInput } from "../validators/projectValidator.js";

export interface ProjectDto {
  _id: string;
  name: string;
  description?: string;
  workspace: string;
  createdBy: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

const mapToProjectDto = (project: ProjectDocument): ProjectDto => {
  const obj = project.toObject();
  return {
    _id: obj._id.toString(),
    name: obj.name,
    description: obj.description,
    workspace: obj.workspace.toString(),
    createdBy: obj.createdBy.toString(),
    status: obj.status,
    startDate: obj.startDate,
    endDate: obj.endDate,
  };
};

export const createProject = async (
  userId: string,
  workspaceId: string,
  data: CreateProjectInput,
): Promise<ProjectDto> => {
  const member = await workspaceRepo.findWorkspaceMember(workspaceId, userId);
  if (!member || member.role !== "admin") {
    throw new ApiError(403, "Only workspace admins can create projects");
  }

  if (new Date(data.endDate) <= new Date(data.startDate)) {
    throw new ApiError(400, "End date must be after start date");
  }

  const project = await projectRepo.createProject({
    ...data,
    workspace: new mongoose.Types.ObjectId(workspaceId),
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  return mapToProjectDto(project);
};

export const getWorkspaceProjects = async (
  userId: string,
  workspaceId: string,
): Promise<ProjectDto[]> => {
  const member = await workspaceRepo.findWorkspaceMember(workspaceId, userId);
  if (!member)
    throw new ApiError(403, "You are not a member of this workspace");

  const projects = await projectRepo.findProjectsByWorkspace(workspaceId);
  return projects.map(mapToProjectDto);
};
