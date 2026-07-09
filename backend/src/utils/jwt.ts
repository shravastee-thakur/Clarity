import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "./apiError.js";

export interface TokenPayload extends JwtPayload {
  id: string;
}

export interface MagicTokenInput {
  id: string;
  email: string;
}

export interface MagicTokenPayload extends MagicTokenInput {
  type: "magic_login" | "workspace_invite";
}

const accessSecret = env.ACCESS_SECRET;
const refreshSecret = env.REFRESH_SECRET;
const magicSecret = env.MAGIC_SECRET;

if (!accessSecret || !refreshSecret || !magicSecret) {
  throw new ApiError(500, "Missing required JWT environment variables");
}

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, accessSecret) as TokenPayload;
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, refreshSecret) as TokenPayload;
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

// --- MAGIC LINK & INVITE TOKENS ---

export const generateMagicToken = (
  payload: MagicTokenInput,
  type: "magic_login" | "workspace_invite",
) => {
  return jwt.sign({ ...payload, type }, magicSecret, { expiresIn: "15m" });
};

export const verifyMagicToken = (
  token: string,
  expectedType: "magic_login" | "workspace_invite",
): MagicTokenPayload => {
  try {
    const decoded = jwt.verify(token, magicSecret) as MagicTokenPayload;

    if (decoded.type !== expectedType) {
      throw new Error("Token type mismatch");
    }

    return decoded;
  } catch (error) {
    throw new ApiError(401, "Invalid or expired magic link");
  }
};
