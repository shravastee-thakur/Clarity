import mongoose from "mongoose";
import * as workspaceRepo from "../repositories/workspaceRepo.js";
import {
  WorkspaceDocument,
  CreateWorkspaceInput,
} from "../repositories/workspaceRepo.js";
import { ApiError } from "../utils/apiError.js";

export interface WorkspaceDto {
  _id: string;
  name: string;
  slug: string;
  owner: string;
  memberCount: number;
}

const mapToWorkspaceDto = (workspace: WorkspaceDocument): WorkspaceDto => {
  const obj = workspace.toObject();

  return {
    _id: obj._id.toString(),
    name: obj.name,
    slug: obj.slug,
    owner: obj.owner.toString(),
    memberCount: obj.memberCount,
  };
};

export const setUpWorkspace = async (
  data: CreateWorkspaceInput,
): Promise<WorkspaceDto> => {
  // 1. Enforce the business rule: A user can only own one workspace
  const existingWorkspace = await workspaceRepo.findWorkspaceByOwner(
    data.owner,
  );
  if (existingWorkspace) {
    throw new ApiError(409, "You already own a workspace");
  }

  // 2. Check if the slug is already taken by another company
  const slugExists = await workspaceRepo.findWorkspaceBySlug(data.slug);
  if (slugExists) {
    throw new ApiError(409, "This workspace URL is already taken");
  }

  const workspace = await workspaceRepo.createWorkspace(data);
  await workspaceRepo.addWorkspaceMember({
    workspace: workspace._id,
    user: new mongoose.Types.ObjectId(data.owner),
    role: "admin",
  });
  return mapToWorkspaceDto(workspace);
};

export const getWorkspace = async (
  workspaceId: string,
  userId: string,
): Promise<WorkspaceDto> => {
  const member = await workspaceRepo.findWorkspaceMember(workspaceId, userId);
  if (!member)
    throw new ApiError(403, "You are not a member of this workspace");

  const workspace = await workspaceRepo.findWorkspaceById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  return mapToWorkspaceDto(workspace);
};
