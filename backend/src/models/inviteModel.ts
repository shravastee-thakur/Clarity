import mongoose, { Schema, Model } from "mongoose";

export interface IInvite {
  email: string;
  workspaceId: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "declined";
  invitedBy: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const inviteSchema = new Schema<IInvite>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      // This index tells MongoDB to automatically delete the document when this date passes
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

inviteSchema.index({ email: 1, status: 1 });

const Invite: Model<IInvite> = mongoose.model<IInvite>("Invite", inviteSchema);

export default Invite;
