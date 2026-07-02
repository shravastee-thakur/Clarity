import * as workspaceRepo from "../repositories/workspaceRepo.js";
import { ApiError } from "../utils/apiError.js";

// Generate a simple URL friendly slug from the workspace name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const setupWorkspace = async (userId: string, userRole: string, name: string) => {
  if (userRole !== "admin") {
    throw new ApiError(403, "Only admins can create workspaces");
  }

  const slug = generateSlug(name);
  
  // Check if slug is taken to prevent unique constraint crashes
  const existing = await workspaceRepo.findWorkspaceBySlug(slug);
  if (existing) {
    throw new ApiError(409, "Workspace name already in use");
  }

  const workspace = await workspaceRepo.createWorkspace({
    name,
    slug,
    owner: userId,
  });

  return workspace;
};

export const setupProject = async (
  userId: string, 
  userRole: string, 
  workspaceId: string, 
  name: string,
  description?: string
) => {
  if (userRole !== "admin") {
    throw new ApiError(403, "Only admins can create projects");
  }

  const workspace = await workspaceRepo.findWorkspaceById(workspaceId);
  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  // Ensure the admin actually owns this workspace
  if (workspace.owner.toString() !== userId) {
    throw new ApiError(403, "You do not own this workspace");
  }

  const project = await workspaceRepo.createProject({
    name,
    description,
    workspace: workspaceId,
    createdBy: userId,
  });

  return project;
};