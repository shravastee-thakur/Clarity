import { redis } from "../config/redis.js";
import crypto from "crypto";

const OTP_TTL = 300;
const MAX_ATTEMPTS = 3;

const verifyAndDelete = `
  local key = KEYS[1]
  local input_hash = ARGV[1]
  local max_attempts = tonumber(ARGV[2])

  local stored_hash = redis.call("HGET", key, "otp")
  local attempts = tonumber(redis.call("HGET", key, "attempts")) or 0

  if attempts >= max_attempts then
    redis.call("DEL", key)
    return -1
  end

  if stored_hash == input_hash then
    redis.call("DEL", key)
    return 1
  else
    redis.call("HINCRBY", key, "attempts", 1)
    redis.call("EXPIRE", key, 300)
    return 0
  end
`;

const verifyOtpAndIssueTokenScript = `
  local otp_key = KEYS[1]
  local token_key = KEYS[2]
  local input_hash = ARGV[1]
  local reset_token = ARGV[2]
  local max_attempts = tonumber(ARGV[3])

  local attempts = tonumber(redis.call("HGET", otp_key, "attempts")) or 0
  if attempts >= max_attempts then
    redis.call("DEL", otp_key)
    return -1
  end
  
  local stored_hash = redis.call("HGET", otp_key, "otp")
  if stored_hash == input_hash then
    redis.call("DEL", otp_key)
    redis.call("SET", token_key, reset_token, "EX", 120)
    return 1
  end
  
  redis.call("HINCRBY", otp_key, "attempts", 1)
  redis.call("EXPIRE", otp_key, 300)
  return 0
`;

const consumeResetTokenScript = `
  local token_key = KEYS[1]
  local input_token = ARGV[1]

  local stored_token = redis.call("GET", token_key)
  if stored_token == input_token then
    redis.call("DEL", token_key)
    return 1
  end
  return 0
`;

export const saveOtp = async (
  identifier: string,
  hashedOtp: string,
  purpose: "login" | "reset" = "login",
) => {
  const key = `${purpose}_otp:${identifier}`;
  await redis.hset(key, { otp: hashedOtp, attempts: 0 });
  await redis.expire(key, OTP_TTL);
};

export const consumeOtp = async (
  identifier: string,
  hashedOtp: string,
): Promise<boolean> => {
  const key = `login_otp:${identifier}`;

  const result = (await redis.eval(
    verifyAndDelete,
    1,
    key,
    hashedOtp,
    MAX_ATTEMPTS.toString(),
  )) as number;

  if (result === -1) {
    throw new Error("Too many attempts. Please request a new OTP.");
  }

  return result === 1;
};

export const verifyAndIssueResetToken = async (
  identifier: string,
  hashedOtp: string,
): Promise<string | null> => {
  const otpKey = `reset_otp:${identifier}`;
  const tokenKey = `reset_token:${identifier}`;

  const resetToken = crypto.randomBytes(32).toString("hex");

  const result = (await redis.eval(
    verifyOtpAndIssueTokenScript,
    2,
    otpKey,
    tokenKey,
    hashedOtp,
    resetToken,
    MAX_ATTEMPTS.toString(),
  )) as number;

  if (result === -1) {
    throw new Error("Too many attempts. Please request a new OTP.");
  }

  if (result === 0) {
    return null;
  }

  return resetToken;
};

export const consumeResetToken = async (
  identifier: string,
  resetToken: string,
): Promise<boolean> => {
  const tokenKey = `reset_token:${identifier}`;

  const result = (await redis.eval(
    consumeResetTokenScript,
    1,
    tokenKey,
    resetToken,
  )) as number;

  return result === 1;
};
