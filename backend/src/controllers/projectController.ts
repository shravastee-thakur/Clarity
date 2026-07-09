import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/projectService.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/projectValidator.js";
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

    res
      .status(201)
      .json({
        success: true,
        data: project,
        message: "Project created successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const workspaceId = req.params.workspaceId as string;

    const projects = await projectService.getWorkspaceProjects(
      userId,
      workspaceId,
    );
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const workspaceId = req.params.workspaceId as string;
    const projectId = req.params.projectId as string;

    const validatedData = updateProjectSchema.parse(req.body);

    const updatedProject = await projectService.updateProject(
      userId,
      workspaceId,
      projectId,
      validatedData,
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};
