import express from "express";
import * as userController from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { sanitizeMiddleware } from "../middlewares/sanitize.js";
import { securityMiddleware } from "../middlewares/securityMiddleware.js";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Register
router.post(
  "/",
  sanitizeMiddleware,
  rateLimiterMiddleware(3, 60),
  userController.createUser,
);

// Login step one
router.post(
  "/otp-requests",
  securityMiddleware,
  sanitizeMiddleware,
  rateLimiterMiddleware(3, 60),
  userController.createOtpRequest,
);

// Verify otp (Login)
router.post(
  "/sessions",
  securityMiddleware,
  sanitizeMiddleware,
  rateLimiterMiddleware(5, 60),
  userController.createSession,
);

// Logout
router.delete("/sessions", authenticate, userController.destroySession);

// Refresh
router.post("/tokens", userController.createToken);

// --- PASSWORD RESET FLOW ---

// 1. Forget password (Initiates reset, sends OTP via email)
router.post(
  "/password-resets",
  sanitizeMiddleware,
  rateLimiterMiddleware(3, 60),
  userController.createPasswordReset,
);

// 2. Verify Reset OTP (Verifies OTP, issues intermediate reset token)
router.post(
  "/password-resets/verify",
  securityMiddleware,
  sanitizeMiddleware,
  rateLimiterMiddleware(5, 60),
  userController.verifyResetOtp,
);

// 3. Reset password (Consumes intermediate reset token, updates password)
router.patch(
  "/password-resets",
  securityMiddleware,
  sanitizeMiddleware,
  rateLimiterMiddleware(3, 60),
  userController.updatePassword,
);

export default router;