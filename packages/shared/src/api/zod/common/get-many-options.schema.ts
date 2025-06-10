import { z } from "zod";
import {
  EOperandPredicate,
  EPredicate,
  ESortDirection,
} from "@way-to-bot/shared/api/enums/index.js";

export const PaginationSchema = z
  .object({
    limit: z.number().optional(),
    offset: z.number().optional(),
  })
  .strict();

export const BaseOperand = z
  .object({
    field: z.string(),
    predicate: z.nativeEnum(EOperandPredicate),
    value: z.any(),
  })
  .strict();

export const WhereSchema: z.ZodType<any> = z.lazy(() =>
  z
    .object({
      predicate: z.nativeEnum(EPredicate),
      operands: z.array(z.union([BaseOperand, WhereSchema])),
    })
    .strict(),
);

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

export type TBaseOperand = z.infer<typeof BaseOperand>;
export type TWhereSchema = z.infer<typeof WhereSchema>;
export type TCommonGetManyOptions = z.infer<typeof CommonSchemaGetManyOptions>;
export type TCommonPagination = z.infer<typeof PaginationSchema>;
export type TCommonWhere = z.infer<typeof WhereSchema>;
export type TCommonSort = z.infer<typeof SortSchema>;
