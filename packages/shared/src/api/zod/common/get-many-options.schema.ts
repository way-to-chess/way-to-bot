import { z } from "zod";
import { EPredicate, ESortDirection } from "@way-to-bot/shared/api/enums/index";

export const PaginationSchema = z
  .object({
    limit: z.number().optional(),
    offset: z.number().optional(),
  })
  .strict();

export const WhereSchema = z
  .object({
    field: z.string(),
    predicate: z.nativeEnum(EPredicate),
    value: z.any(),
  })
  .strict();

export const SortSchema = z
  .object({
    field: z.string(),
    direction: z.nativeEnum(ESortDirection),
  })
  .strict();

export const CommonSchemaGetManyOptions = z
  .object({
    pagination: PaginationSchema.optional(),
    where: WhereSchema.optional(),
    sort: SortSchema.optional(),
  })
  .strict();

export type TCommonGetManyOptions = z.infer<typeof CommonSchemaGetManyOptions>;
export type TCommonPagination = z.infer<typeof PaginationSchema>;
export type TCommonWhere = z.infer<typeof WhereSchema>;
export type TCommonSort = z.infer<typeof SortSchema>;
