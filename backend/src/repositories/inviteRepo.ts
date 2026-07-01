import WorkspaceInvite, {
  IWorkspaceInvite,
} from "../models/WorkspaceInviteModel.js";
import { HydratedDocument } from "mongoose";

export type InviteDocument = HydratedDocument<IWorkspaceInvite>;

export const findActiveInviteByEmail = async (
  email: string,
): Promise<InviteDocument | null> => {
  return WorkspaceInvite.findOne({
    email,
    status: "pending",
    expiresAt: { $gt: new Date() },
  }).exec();
};

export const updateInviteStatus = async (
  inviteId: string,
  status: "accepted" | "declined",
): Promise<InviteDocument | null> => {
  return WorkspaceInvite.findByIdAndUpdate(
    inviteId,
    { status },
    { returnDocument: "after" },
  ).exec();
};
