import { env } from "../config/env.js";
import * as userRepo from "../repositories/userRepo.js";
import * as otpService from "../services/otpService.js";
import { UserDocument, CreateUserInput } from "../repositories/userRepo.js";
import { ApiError } from "../utils/apiError.js";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
  verifyRefreshToken,
} from "../utils/jwt.js";
import * as emailService from "../services/emailService.js";

export interface UserDto {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  refreshToken: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserContext extends UserDto {
  workspaceStatus: "setup" | "invited" | "pending" | "active";
  activeWorkspaceId?: string;
}

export interface RegisterInput extends CreateUserInput {}
export interface LoginInput {
  email: string;
  password: string;
}

const mapToUserDto = (user: UserDocument): UserDto => {
  const obj = user.toObject();

  return {
    _id: obj._id.toString(),
    name: obj.name,
    email: obj.email,
    role: obj.role,
    refreshToken: obj.refreshToken,
    isVerified: obj.isVerified,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// Register
export const createUser = async (userData: RegisterInput): Promise<UserDto> => {
  const existingUser = await userRepo.findByEmail(userData.email);
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await userRepo.createUser(userData);

  return mapToUserDto(user);
};

// -----x-----(login)------
// Login verify
export const loginVerifyCredentials = async (
  userData: LoginInput,
): Promise<UserDto> => {
  const user = await userRepo.findByEmail(userData.email);
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const match = await user.comparePassword(userData.password);
  if (!match) {
    throw new ApiError(401, "Invalid credentials");
  }

  return mapToUserDto(user);
};

// hmac hashing
export const hashedOtp = (otp: string): string => {
  return crypto.createHmac("sha256", env.HMAC_SECRET).update(otp).digest("hex");
};

const generateOtp = () => String(crypto.randomInt(100000, 1000000));

// Otp save
export const processLoginOtp = async (email: string) => {
  const otp = generateOtp();
  await otpService.saveOtp(email, hashedOtp(otp), "login");
  emailService.sendLoginOtpEmail(email, otp);
  return { success: true, message: "OTP sent successfully." };
};

// Verify Otp
export const verifyUserOtp = async (email: string, otp: string) => {
  const inputHash = hashedOtp(otp);

  const isValid = await otpService.consumeOtp(email, inputHash);
  if (!isValid) {
    throw new ApiError(401, "Invalid or expired OTP");
  }

  let user = await userRepo.findByEmail(email);
  if (!user) throw new ApiError(404, "User not found");

  if (!user.isVerified) {
    const updatedUser = await userRepo.updateUser(user._id.toString(), {
      isVerified: true,
    });
    if (!updatedUser)
      throw new ApiError(500, "Failed to update user verification status");
    user = updatedUser;
  }

  return mapToUserDto(user);
};

// -----x-----(token rotate)--------

export const createTokensAndSave = async (user: UserDto) => {
  const tokenPayload = {
    id: user._id.toString(),
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const hashedRefresh = crypto
    .createHmac("sha256", env.HMAC_SECRET)
    .update(refreshToken)
    .digest("hex");

  await userRepo.updateUser(user._id.toString(), {
    refreshToken: hashedRefresh,
  });

  return { accessToken, refreshToken };
};

export const rotateRefreshToken = async (oldToken: string) => {
  let decoded: TokenPayload;

  try {
    decoded = verifyRefreshToken(oldToken);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await userRepo.findById(decoded.id);
  if (!user) throw new ApiError(404, "User not found");

  const hashedRefreshToken = crypto
    .createHmac("sha256", env.HMAC_SECRET)
    .update(oldToken)
    .digest("hex");

  const storedBuffer = Buffer.from(user.refreshToken, "hex");
  const hashBuffer = Buffer.from(hashedRefreshToken, "hex");

  const isMatch =
    storedBuffer.length === hashBuffer.length &&
    crypto.timingSafeEqual(storedBuffer, hashBuffer);

  if (!isMatch) {
    throw new ApiError(401, "Refresh token mismatch");
  }

  const safeUser = mapToUserDto(user);

  const { accessToken, refreshToken } = await createTokensAndSave(safeUser);

  return { accessToken, refreshToken, user: safeUser };
};

// ------x------(forget password)-------

export const sendResetOTP = async (email: string) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    return {
      success: true,
      message: "If an account exists, an OTP has been sent.",
    };
  }

  const otp = generateOtp();
  await otpService.saveOtp(email, hashedOtp(otp), "reset");
  emailService.sendPasswordResetEmail(email, otp);
  return {
    success: true,
    message: "If an account exists, an OTP has been sent.",
  };
};

export const verifyResetCode = async (email: string, otp: string) => {
  const inputHash = hashedOtp(otp);

  const resetToken = await otpService.verifyAndIssueResetToken(
    email,
    inputHash,
  );
  if (!resetToken) {
    throw new ApiError(401, "Invalid or expired OTP");
  }

  return { success: true, resetToken };
};

export const updatePasswordWithToken = async (
  email: string,
  resetToken: string,
  newPassword: string,
) => {
  const isValid = await otpService.consumeResetToken(email, resetToken);
  if (!isValid) {
    throw new ApiError(401, "Invalid or expired reset token");
  }

  const user = await userRepo.findByEmail(email);
  if (!user) throw new ApiError(404, "User not found");

  user.password = newPassword;

  // Critical security step: Invalidate all existing sessions upon password change
  user.refreshToken = "";
  await user.save();

  return { success: true, message: "Password updated successfully" };
};

// ------x------(logout)-----

export const logout = async (userId: string) => {
  if (!userId) {
    throw new ApiError(400, "User ID is required for logout");
  }

  await userRepo.updateUser(userId, { refreshToken: "" });
};
