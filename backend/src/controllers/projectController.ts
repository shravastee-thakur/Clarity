import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/projectService.js";
import { createProjectSchema } from "../validators/projectValidator.js";
import logger from "../utils/logger.js";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createProjectSchema.parse(req.body);
    const userId = req.user?.id as string;
    const workspaceId = req.params.workspaceId as string;

    const project = await projectService.createProject(
      userId,
      workspaceId,
      validatedData,
    );

    logger.info("Project created successfully", {
      userId,
      workspaceId,
      projectId: project._id,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};
