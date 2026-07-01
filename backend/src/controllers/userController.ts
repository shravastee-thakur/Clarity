import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService.js";
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../validators/authValidator.js";
import logger from "../utils/logger.js";
import { sendAuthResponse } from "../helper/sendAuthResponse.js";
import { ApiError } from "../utils/apiError.js";
import { env } from "../config/env.js";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await userService.createUser(validatedData);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// POST /otp-requests
export const createOtpRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await userService.loginVerifyCredentials(validatedData);

    const result = await userService.processLoginOtp(user.email);

    logger.info(`OTP sent to ${user.email}`);

    return res.status(200).json({
      success: true,
      message: result.message,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// POST /sessions
export const createSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = verifyOtpSchema.parse(req.body);
    const { email, otp } = validatedData;
    const user = await userService.verifyUserOtp(email, otp);

    const token = await userService.createTokensAndSave(user);
    logger.info(`OTP verified. Login success for ${email}`);

    return sendAuthResponse(res, token, user, "Logged in successfully");
  } catch (error) {
    next(error);
  }
};

// POST /tokens
export const createToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const oldToken = req.cookies?.refreshToken;
    if (!oldToken) throw new ApiError(401, "Refresh token missing");

    const { accessToken, refreshToken, user } =
      await userService.rotateRefreshToken(oldToken);

    const userContext = await userService.buildUserContext(user);

    return sendAuthResponse(
      res,
      { accessToken, refreshToken },
      userContext,
      "Token refreshed",
    );
  } catch (error) {
    next(error);
  }
};

// POST /password-resets
export const createPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = forgetPasswordSchema.parse(req.body);
    const { email } = validatedData;
    const result = await userService.sendResetOTP(email);

    logger.info(`Password reset OTP sent to ${email}`);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// POST /password-resets
export const verifyResetOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = verifyOtpSchema.parse(req.body);
    const { email, otp } = validatedData;
    const result = await userService.verifyResetCode(email, otp);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// PATCH /password-resets
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, resetToken, newPassword } = resetPasswordSchema.parse(
      req.body,
    );
    const result = await userService.updatePasswordWithToken(
      email,
      resetToken,
      newPassword,
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// DELETE /sessions
export const destroySession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    await userService.logout(userId);

    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      })
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
