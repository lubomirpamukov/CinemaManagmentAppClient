import { z, type ZodTypeAny } from "zod";

export const createPaginatedResponseSchema = <T extends ZodTypeAny>(
  itemSchema: T
) => {
  return z.object({
    data: z.array(itemSchema),
    totalPages: z.number().int().positive().default(1),
    currentPage: z.number().int().positive().default(1),
  });
};