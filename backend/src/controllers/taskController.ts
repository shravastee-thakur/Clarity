import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/taskService.js";
import { createTaskSchema } from "../validators/taskValidator.js";
import logger from "../utils/logger.js";

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const userId = req.user?.id as string;
    const workspaceId = req.params.workspaceId as string;

    const task = await taskService.assignTask(
      userId,
      workspaceId,
      validatedData,
    );

    logger.info("Task assigned successfully", {
      createdBy: userId,
      assigneeId: task.assignee,
      workspaceId,
      taskId: task._id,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const getProjectTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const workspaceId = req.params.workspaceId as string;
    const projectId = req.params.projectId as string;

    const tasks = await taskService.getProjectTasks(
      userId,
      workspaceId,
      projectId,
    );
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getMyTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id as string;
    const workspaceId = req.params.workspaceId as string;

    const tasks = await taskService.getMyTasks(userId, workspaceId);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};
