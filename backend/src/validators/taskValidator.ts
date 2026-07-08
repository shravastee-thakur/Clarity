import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createTaskSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  assigneeId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.coerce.date(),
});

export const workspaceParamsSchema = z.object({
  workspaceId: mongoIdSchema,
});

export const projectParamSchema = z.object({
  projectId: mongoIdSchema,
});

export const taskParamsSchema = z.object({
  workspaceId: mongoIdSchema,
  taskId: mongoIdSchema,
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(["todo", "in_progress", "blocked", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z.coerce.date().optional(),
    assigneeId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "You must provide at least one field to update",
  });
