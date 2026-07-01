import mongoose, { Schema, Model } from "mongoose";

export interface IWorkspaceInvite {
  email: string;
  workspaceId: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "declined";
  invitedBy: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const workspaceInviteSchema = new Schema<IWorkspaceInvite>(
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

workspaceInviteSchema.index({ email: 1, status: 1 });

const WorkspaceInvite: Model<IWorkspaceInvite> =
  mongoose.model<IWorkspaceInvite>("WorkspaceInvite", workspaceInviteSchema);

export default WorkspaceInvite;
