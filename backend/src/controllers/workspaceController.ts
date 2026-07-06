import { Request, Response, NextFunction } from "express";
import * as workspaceService from "../services/workspaceService.js";
import { createWorkspaceSchema } from "../validators/workspaceValidator.js";
import logger from "../utils/logger.js";

export const createWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createWorkspaceSchema.parse(req.body);
    const owner = req.user?.id as string;

    const workspace = await workspaceService.setUpWorkspace({
      ...validatedData,
      owner,
    });

    logger.info("Workspace created successfully", {
      owner,
      workspaceId: workspace._id,
      slug: workspace.slug,
    });

    res.status(201).json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
};

export const getWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const workspaceId = req.params.workspaceId as string;

    const workspace = await workspaceService.getWorkspace(workspaceId, userId);

    logger.info("Workspace fetched", {
      userId,
      workspaceId: workspace._id,
    });

    res.status(200).json({ success: true, data: workspace });
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const workspaceId = req.params.workspaceId as string;

    const members = await workspaceService.getWorkspaceMembers(
      workspaceId,
      userId,
    );

    res.status(200).json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};
