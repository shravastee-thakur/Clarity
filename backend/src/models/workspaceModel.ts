import mongoose, { Schema, Model } from "mongoose";

export interface IWorkspace {
  name: string;
  slug: string;
  owner: mongoose.Types.ObjectId;
  memberCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const workSpaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    memberCount: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

const Workspace = mongoose.model("Workspace", workSpaceSchema);
export default Workspace;
