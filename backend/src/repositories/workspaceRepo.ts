import Workspace, { IWorkspace } from "../models/workspaceModel.js";
import WorkspaceMember, {
  IWorkspaceMember,
} from "../models/workspaceMemberModel.js";
import { HydratedDocument } from "mongoose";

export type WorkspaceDocument = HydratedDocument<IWorkspace>;
export interface CreateWorkspaceInput {
  name: string;
  slug: string;
  owner: string;
}

export const createWorkspace = async (
  data: CreateWorkspaceInput,
): Promise<WorkspaceDocument> => {
  return Workspace.create(data);
};

export const findWorkspaceById = async (
  id: string,
): Promise<WorkspaceDocument | null> => {
  return Workspace.findById(id).exec();
};

// export const incrementMemberCount = async (
//   id: string,
// ): Promise<WorkspaceDocument | null> => {
//   return Workspace.findByIdAndUpdate(
//     id,
//     { $inc: { memberCount: 1 } },
//     { new: true },
//   ).exec();
// };

export const addWorkspaceMember = async (
  data: Partial<IWorkspaceMember>,
): Promise<HydratedDocument<IWorkspaceMember>> => {
  return WorkspaceMember.create(data);
};

export const findWorkspaceMember = async (
  workspaceId: string,
  userId: string,
): Promise<HydratedDocument<IWorkspaceMember> | null> => {
  return WorkspaceMember.findOne({
    workspace: workspaceId,
    user: userId,
  }).exec();
};

export const findWorkspaceByOwner = async (
  ownerId: string,
): Promise<WorkspaceDocument | null> => {
  return Workspace.findOne({ owner: ownerId }).exec();
};
