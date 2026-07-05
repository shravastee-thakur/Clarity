import { Request, Response, NextFunction } from "express";
import * as inviteService from "../services/inviteService.js";
import {
  sendInviteSchema,
  acceptInviteSchema,
} from "../validators/inviteValidator.js";
import { sendAuthResponse } from "../helper/sendAuthResponse.js";

export const sendInvite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = sendInviteSchema.parse(req.body);
    const adminId = req.user?.id as string;
    const workspaceId = req.params.workspaceId as string;

    const result = await inviteService.sendWorkspaceInvite(
      adminId,
      workspaceId,
      email,
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const acceptInvite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = acceptInviteSchema.parse(req.body);

    const { tokens, userContext } =
      await inviteService.acceptWorkspaceInvite(token);

    return sendAuthResponse(
      res,
      tokens,
      userContext,
      "Invite accepted and logged in",
    );
  } catch (error) {
    next(error);
  }
};
