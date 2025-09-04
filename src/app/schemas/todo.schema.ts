import { z } from "zod";

export const todoCreateSchema = z.object({
  title: z.string().min(1).max(200),
});

export const todoUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  done: z.boolean().optional(),
});

export type TodoCreate = z.infer<typeof todoCreateSchema>;
export type TodoUpdate = z.infer<typeof todoUpdateSchema>;
