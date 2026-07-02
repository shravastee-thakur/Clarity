import mongoose, { Schema, Model } from "mongoose";

export interface IWorkspaceMember {
  workspace: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  role: "admin" | "member";
  joinedAt: Date;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>({
  workspace: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

workspaceMemberSchema.index({ workspace: 1, user: 1 }, { unique: true });

const WorkspaceMember = mongoose.model<IWorkspaceMember>(
  "WorkspaceMember",
  workspaceMemberSchema,
);
export default WorkspaceMember;
