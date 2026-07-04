import mongoose, { Schema, Model } from "mongoose";

export interface IProject {
  name: string;
  description?: string;
  workspace: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  status: "active" | "archived";
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// This index makes fetching all projects for a specific workspace extremely fast
projectSchema.index({ workspace: 1, status: 1 });

const Project: Model<IProject> = mongoose.model<IProject>(
  "Project",
  projectSchema,
);
export default Project;
