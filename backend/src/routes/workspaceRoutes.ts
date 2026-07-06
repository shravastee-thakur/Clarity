import express from "express";
import * as workspaceController from "../controllers/workspaceController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authenticate);

router.post("/", workspaceController.createWorkspace);
router.get("/:workspaceId", workspaceController.getWorkspace);

router.get("/:workspaceId/members", workspaceController.getMembers);

export default router;
