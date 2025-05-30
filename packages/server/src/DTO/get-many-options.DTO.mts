import { Equal, FindManyOptions, In, Like, Not } from "typeorm";
import {
  TCommonGetManyOptions,
  TCommonPagination,
  TCommonSort,
  TCommonWhere,
} from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { EPredicate } from "@way-to-bot/shared/api/enums/index.ts";

export class GetManyOptionsDTO<Entity> {
  private readonly _findOptions: FindManyOptions<Entity>;

  constructor(parsedQuery: TCommonGetManyOptions) {
    this._findOptions = {
      ...(parsedQuery.pagination &&
        this.getPaginationOptions(parsedQuery.pagination)),
      ...(parsedQuery.where && this.getWhereOptions(parsedQuery.where)),
      ...(parsedQuery.sort && this.getSortOptions(parsedQuery.sort)),
    } as FindManyOptions<Entity>;
    console.log(this._findOptions);
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

  private getWhereOptions(whereOptions: TCommonWhere): FindManyOptions {
    return {
      where: {
        [whereOptions.field]: this.getPredicate(
          whereOptions.predicate,
          whereOptions.value,
        ),
      },
    };
  }

  private getPredicate(predicate: EPredicate, value: any) {
    switch (predicate) {
      case EPredicate.EQ:
        return Equal(value);
      case EPredicate.NOT_EQ:
        return Not(value);
      case EPredicate.IN:
        return In(value);
      case EPredicate.NOT_IN:
        return Not(In(value));
      case EPredicate.LIKE:
        return Like(value);
      default:
        throw new Error(`Unknown predicate ${predicate}`);
    }
  }

  private getSortOptions(sortOptions: TCommonSort): FindManyOptions {
    return { order: { [sortOptions.field]: sortOptions.direction } };
  }
}
