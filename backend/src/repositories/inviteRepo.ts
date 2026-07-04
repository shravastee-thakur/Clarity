import Invite, { IInvite } from "../models/inviteModel.js";
import { HydratedDocument } from "mongoose";

export type InviteDocument = HydratedDocument<IInvite>;

export type CreateInviteInput = Pick<
  IInvite,
  "email" | "workspaceId" | "invitedBy" | "expiresAt"
>;

export const createInvite = async (
  data: CreateInviteInput,
): Promise<InviteDocument> => {
  return Invite.create(data);
};

export const findInviteById = async (
  inviteId: string,
): Promise<InviteDocument | null> => {
  return Invite.findById(inviteId).exec();
};

export const findPendingInviteByEmailAndWorkspace = async (
  email: string,
  workspaceId: string,
): Promise<InviteDocument | null> => {
  return Invite.findOne({
    email,
    workspaceId,
    status: "pending",
    expiresAt: { $gt: new Date() },
  }).exec();
};

export const updateInviteStatus = async (
  inviteId: string,
  status: "accepted" | "declined",
): Promise<InviteDocument | null> => {
  return Invite.findByIdAndUpdate(
    inviteId,
    { status },
    { returnDocument: "after" },
  ).exec();
};
