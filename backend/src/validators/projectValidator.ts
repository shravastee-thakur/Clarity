import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
