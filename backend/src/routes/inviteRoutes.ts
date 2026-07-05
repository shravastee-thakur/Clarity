import express from "express";
import * as inviteController from "../controllers/inviteController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { sanitizeMiddleware } from "../middlewares/sanitize.js";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Admin sends an invite (Requires authentication)
router.post(
  "/workspaces/:workspaceId/invites",
  authenticate,
  sanitizeMiddleware,
  rateLimiterMiddleware(5, 60),
  inviteController.sendInvite,
);

// Employee accepts the invite (Public endpoint)
router.post(
  "/invites/accept",
  sanitizeMiddleware,
  rateLimiterMiddleware(5, 60),
  inviteController.acceptInvite,
);

export default router;
