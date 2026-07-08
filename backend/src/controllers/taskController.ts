import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/taskService.js";
import {
  createTaskSchema,
  projectParamSchema,
  taskParamsSchema,
  updateTaskSchema,
  workspaceParamsSchema,
} from "../validators/taskValidator.js";
import logger from "../utils/logger.js";

export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);
    const userId = req.user?.id as string;
    const { workspaceId } = workspaceParamsSchema.parse(req.params);

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

    res
      .status(201)
      .json({
        success: true,
        data: task,
        message: "Task assigned successfully",
      });
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
    const { workspaceId } = workspaceParamsSchema.parse(req.params);
    const { projectId } = projectParamSchema.parse(req.params);

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
    const { workspaceId } = workspaceParamsSchema.parse(req.params);

    const tasks = await taskService.getMyTasks(userId, workspaceId);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = workspaceParamsSchema.parse(req.params);
    const userId = req.user?.id as string;

    const stats = await taskService.getAdminDashboardStats(userId, workspaceId);
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getFocusTasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId } = workspaceParamsSchema.parse(req.params);
    const userId = req.user?.id as string;

    const tasks = await taskService.getEmployeeFocusTasks(userId, workspaceId);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

export const reportBlocker = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId, taskId } = taskParamsSchema.parse(req.params);
    const userId = req.user?.id as string;

    const task = await taskService.reportTaskBlocker(
      userId,
      workspaceId,
      taskId,
    );

    logger.info("Task blocker reported", { userId, workspaceId, taskId });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId, taskId } = taskParamsSchema.parse(req.params);
    const validatedData = updateTaskSchema.parse(req.body);
    const userId = req.user?.id as string;

    const task = await taskService.updateTask(
      userId,
      workspaceId,
      taskId,
      validatedData,
    );

    logger.info("Task updated successfully", { userId, taskId, workspaceId });

    res
      .status(200)
      .json({ success: true, data: task, message: "Task status updated" });
  } catch (error) {
    next(error);
  }
};
