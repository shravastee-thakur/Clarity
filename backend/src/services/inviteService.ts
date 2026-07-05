// services/inviteService.ts
import * as inviteRepo from "../repositories/inviteRepo.js";
import { InviteDocument } from "../repositories/inviteRepo.js";
import * as userRepo from "../repositories/userRepo.js";
import * as workspaceRepo from "../repositories/workspaceRepo.js";
import { generateMagicToken, verifyMagicToken } from "../utils/jwt.js";
import * as emailService from "./emailService.js";
import { ApiError } from "../utils/apiError.js";
import crypto from "crypto";
import {
  buildUserContext,
  mapToUserDto,
  createTokensAndSave,
} from "../services/userService.js";
import mongoose from "mongoose";

export interface InviteDto {
  _id: string;
  email: string;
  workspaceId: string;
  status: "pending" | "accepted" | "declined";
  invitedBy: string;
  expiresAt: Date;
}

const mapToInviteDto = (invite: InviteDocument): InviteDto => {
  const obj = invite.toObject();
  return {
    _id: obj._id.toString(),
    email: obj.email,
    workspaceId: obj.workspaceId.toString(),
    status: obj.status,
    invitedBy: obj.invitedBy.toString(),
    expiresAt: obj.expiresAt,
  };
};

// Flow 1: Admin sends the invite
export const sendWorkspaceInvite = async (
  adminId: string,
  workspaceId: string,
  targetEmail: string,
) => {
  // 1. Verify the admin actually owns or manages this workspace
  const member = await workspaceRepo.findWorkspaceMember(workspaceId, adminId);
  if (!member || member.role !== "admin") {
    throw new ApiError(403, "Only workspace admins can send invites");
  }

  // 2. Check if the user is already a member
  const existingMember = await userRepo.findByEmail(targetEmail);
  if (existingMember) {
    const isAlreadyMember = await workspaceRepo.findWorkspaceMember(
      workspaceId,
      existingMember._id.toString(),
    );
    if (isAlreadyMember) {
      throw new ApiError(409, "User is already a member of this workspace");
    }
  }

  // 3. Check for an existing pending invite to prevent spam
  const existingInvite = await inviteRepo.findPendingInviteByEmailAndWorkspace(
    targetEmail,
    workspaceId,
  );
  if (existingInvite) {
    throw new ApiError(
      409,
      "An active invite has already been sent to this email",
    );
  }

  // 4. Create the invite record (expires in 48 hours)
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const invite = await inviteRepo.createInvite({
    email: targetEmail,
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    invitedBy: new mongoose.Types.ObjectId(adminId),
    expiresAt,
  });

  // 5. Generate the magic token specifically for invites
  const token = generateMagicToken(
    { id: invite._id.toString(), email: targetEmail },
    "workspace_invite",
  );

  // 6. Fetch workspace name for the email and send it
  const workspace = await workspaceRepo.findWorkspaceById(workspaceId);
  const workspaceName = workspace ? workspace.name : "our platform";

  await emailService.sendWorkspaceInviteEmail(
    targetEmail,
    token,
    workspaceName,
  );

  return { success: true, message: "Invitation sent successfully" };
};

// Flow 2: Employee clicks the link and accepts
export const acceptWorkspaceInvite = async (token: string) => {
  // 1. Verify the token signature and expiration
  let decoded;
  try {
    decoded = verifyMagicToken(token, "workspace_invite");
  } catch (error) {
    throw new ApiError(401, "Invalid or expired invitation link");
  }

  // 2. Fetch the actual invite record from the database
  const invite = await inviteRepo.findInviteById(decoded.id);
  if (!invite) {
    throw new ApiError(404, "Invitation not found");
  }

  // 3. Ensure the invite has not already been used
  if (invite.status !== "pending") {
    throw new ApiError(400, "This invitation has already been used");
  }

  // 4. Handle the Account Paradox (Find or Create the User)
  let user = await userRepo.findByEmail(decoded.email);

  if (!user) {
    // Clean, passwordless user creation

    user = await userRepo.createUser({
      name: decoded.email.split("@")[0], // Use email prefix as temporary name
      email: decoded.email,
      authProvider: "magic",
      isVerified: true, 
    });
  }

  // 5. Add the user to the WorkspaceMember table
  const existingMembership = await workspaceRepo.findWorkspaceMember(
    invite.workspaceId.toString(),
    user._id.toString(),
  );

  if (!existingMembership) {
    await workspaceRepo.addWorkspaceMember({
      workspace: invite.workspaceId,
      user: user._id,
      role: "member",
    });

    // Increment the workspace member count for Phase 4 metrics
    await workspaceRepo.incrementMemberCount(invite.workspaceId.toString());
  }

  // 6. Mark the invite as accepted so the link cannot be reused
  await inviteRepo.updateInviteStatus(invite._id.toString(), "accepted");

  // 7. Build the context and generate standard auth tokens
  const userDto = mapToUserDto(user);
  const userContext = await buildUserContext(userDto);
  const tokens = await createTokensAndSave(userDto);

  return { tokens, userContext };
};
