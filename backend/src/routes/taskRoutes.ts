import express from "express";
import * as taskController from "../controllers/taskController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/workspaces/:workspaceId/tasks",
  authenticate,
  taskController.createTask,
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks",
  authenticate,
  taskController.getProjectTasks,
);
router.get(
  "/workspaces/:workspaceId/tasks/me",
  authenticate,
  taskController.getMyTasks,
);

export default router;
