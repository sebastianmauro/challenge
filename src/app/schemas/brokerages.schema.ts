import { z } from "zod";

export const brokerageCreateSchema = z.object({
  title: z.string().min(1).max(200),
});

export const brokerageUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  done: z.boolean().optional(),
});

export type BrokerageCreate = z.infer<typeof brokerageCreateSchema>;
export type BrokerageUpdate = z.infer<typeof brokerageUpdateSchema>;
