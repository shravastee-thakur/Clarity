import express from "express";
import * as projectController from "../controllers/projectController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/workspaces/:workspaceId/projects",
  authenticate,
  projectController.createProject,
);

router.get(
  "/workspaces/:workspaceId/projects",
  authenticate,
  projectController.getWorkspaceProjects,
);

export default router;
