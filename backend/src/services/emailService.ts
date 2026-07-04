import { env } from "../config/env.js";
import sendMail from "../config/sendMail.js";
import logger from "../utils/logger.js";

const sendEmailAsync = (to: string, subject: string, htmlContent: string) => {
  sendMail(to, subject, htmlContent).catch((err) => {
    logger.error(`Background email failed for ${to}: ${err.message}`);
  });
};

export const sendLoginOtpEmail = (userEmail: string, otp: string) => {
  const htmlContent = `
    <h2>Login Verification</h2>
    <p>Your OTP for login is:</p>
    <h2 style="font-size: 28px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">${otp}</h2>
    <p>This OTP will expire in 5 minutes.</p>
  `;
  sendEmailAsync(userEmail, "Your 2FA Login OTP", htmlContent);
};

export const sendPasswordResetEmail = (userEmail: string, otp: string) => {
  const htmlContent = `
    <h2>Password Reset Request</h2>
    <p>Your OTP for login is:</p>
    <h2 style="font-size: 28px; font-weight: bold; letter-spacing: 8px; color: #4f46e5;">${otp}</h2>
    <p>This OTP will expire in 5 minutes.</p>
  `;
  sendEmailAsync(userEmail, "Reset Your Password", htmlContent);
};

export const sendMagicLoginEmail = (userEmail: string, token: string) => {
  // This URL points to frontend route
  const magicLink = `${env.FRONTEND_URL}/verify-magic?token=${token}`;

  const htmlContent = `
    <h2>Secure Login Link</h2>
    <p>Click the button below to log in to your workspace. This link expires in 15 minutes.</p>
    <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Log In Securely</a>
    <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">If you did not request this link, you can safely ignore this email.</p>
  `;
  sendEmailAsync(userEmail, "Your Secure Login Link", htmlContent);
};

export const sendWorkspaceInviteEmail = (
  userEmail: string,
  token: string,
  workspaceName: string,
) => {
  // This URL points to frontend invite acceptance route
  const inviteLink = `${env.FRONTEND_URL}/accept-invite?token=${token}`;

  const htmlContent = `
    <h2>You are invited to join ${workspaceName}</h2>
    <p>Your team has invited you to collaborate. Click the button below to accept the invite and access your tasks.</p>
    <a href="${inviteLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Accept Invitation</a>
    <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">This invitation will expire in 48 hours.</p>
  `;
  sendEmailAsync(userEmail, `Invitation to join ${workspaceName}`, htmlContent);
};
