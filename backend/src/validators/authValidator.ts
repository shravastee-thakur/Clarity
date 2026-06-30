import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  resetToken: z
    .string()
    .min(64, "Reset token must me atleast 64 characters long"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
