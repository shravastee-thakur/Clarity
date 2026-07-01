import WorkspaceInvite, {IWorkspaceInvite} from "../models/WorkspaceInviteModel.js";
import { HydratedDocument } from "mongoose";

export type WorkspaceInviteDocument = HydratedDocument<IWorkspaceInvite>

export type Create