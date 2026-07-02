import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  assigneeId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.coerce.date(),
});
