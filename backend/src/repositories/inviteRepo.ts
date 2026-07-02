import Invite, { IInvite } from "../models/inviteModel.js";
import { HydratedDocument } from "mongoose";

export type InviteDocument = HydratedDocument<IInvite>;

export const findActiveInviteByEmail = async (
  email: string,
): Promise<InviteDocument | null> => {
  return Invite.findOne({
    email,
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
