import express from "express";
import * as taskController from "../controllers/taskController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/workspaces/:workspaceId/tasks",
  authenticate,
  taskController.createTask,
);

export default router;
