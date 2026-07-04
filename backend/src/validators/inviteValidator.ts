import { z } from "zod";

export const sendInviteSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(10, "Token is required"),
});
