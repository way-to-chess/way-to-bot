import {
  Equal,
  FindManyOptions,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  Not,
} from "typeorm";
import {
  TCommonGetManyOptions,
  TCommonPagination,
  TCommonSort,
  TCommonWhere,
} from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import {
  EOperandPredicate,
  EPredicate,
} from "@way-to-bot/shared/api/enums/index.js";

export class GetManyOptionsDTO<Entity> {
  private readonly _findOptions: FindManyOptions<Entity>;

  constructor(parsedQuery: TCommonGetManyOptions) {
    this._findOptions = {
      ...(parsedQuery.pagination &&
        this.getPaginationOptions(parsedQuery.pagination)),
      ...(parsedQuery.where && this.getWhereOptions(parsedQuery.where)),
      ...(parsedQuery.sort && this.getSortOptions(parsedQuery.sort)),
    } as FindManyOptions<Entity>;
  }

  get getFindOptions() {
    return this._findOptions;
  }

  private getPaginationOptions(
    paginationOptions?: TCommonPagination,
  ): FindManyOptions<Entity> {
    return {
      take: paginationOptions?.limit,
      skip: paginationOptions?.offset,
    };
  }

  private getWhereOptions(whereOptions: TCommonWhere): FindOptionsWhere<any> {
    const finalOptions = {
      where: whereOptions.predicate === EPredicate.OR ? [] : {},
    };

    for (const op of whereOptions.operands) {
      const where = { [op.field]: this.getPredicate(op.predicate, op.value) };

      if (whereOptions.predicate === EPredicate.OR) {
        (finalOptions.where as unknown[]).push(where);
      } else {
        finalOptions.where = { ...finalOptions.where, ...where };
      }
    }

    return finalOptions;
  }

  private getPredicate(predicate: EOperandPredicate, value: any) {
    switch (predicate) {
      case EOperandPredicate.EQ:
        return Equal(value === null ? IsNull() : value);
      case EOperandPredicate.NOT_EQ:
        return Not(value === null ? IsNull() : value);
      case EOperandPredicate.IN:
        return In(value);
      case EOperandPredicate.NOT_IN:
        return Not(In(value));
      case EOperandPredicate.LIKE:
        return Like(`%${value}%`);
      default:
        throw new Error(`Unknown predicate ${predicate}`);
    }
  }

  private getSortOptions(sortOptions: TCommonSort): FindManyOptions {
    return { order: { [sortOptions.field]: sortOptions.direction } };
  }
}
