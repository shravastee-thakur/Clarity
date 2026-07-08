import express from "express";
import * as taskController from "../controllers/taskController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticate);

// Admin Macro Metrics
router.get("/workspaces/:workspaceId/stats", taskController.getAdminStats);

// Employee Micro Execution
router.get(
  "/workspaces/:workspaceId/tasks/focus",
  taskController.getFocusTasks,
);

// General Task Retrieval
router.get("/workspaces/:workspaceId/tasks/me", taskController.getMyTasks);
router.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks",
  taskController.getProjectTasks,
);

// Task Creation
router.post("/workspaces/:workspaceId/tasks", taskController.createTask);

// Employee Blocker Action
router.patch(
  "/workspaces/:workspaceId/tasks/:taskId/block",
  taskController.reportBlocker,
);

// Update task
router.patch(
  "/workspaces/:workspaceId/tasks/:taskId",
  taskController.updateTask,
);

export default router;
