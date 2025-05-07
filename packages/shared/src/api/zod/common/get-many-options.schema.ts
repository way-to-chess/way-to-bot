import { z } from "zod";

export const PaginationSchema = z
  .object({
    pageNumber: z.number().optional(),
    itemsPerPage: z.number().optional(),
  })
  .strict();

export const CommonSchemaGetManyOptions = z
  .object({
    pagination: PaginationSchema.optional(),
    filters: z.record(z.string(), z.any()).optional(),
    sort: z.any().optional(),
  })
  .strict();

export type TCommonGetManyOptions = z.infer<typeof CommonSchemaGetManyOptions>;
export type TCommonPagination = z.infer<typeof PaginationSchema>;
