import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3).max(50),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});
