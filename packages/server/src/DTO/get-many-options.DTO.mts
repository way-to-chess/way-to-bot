import { FindManyOptions } from "typeorm";
import {
  TCommonGetManyOptions,
  TCommonPagination,
} from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";

export class GetManyOptionsDTO<Entity> {
  private readonly _findOptions: FindManyOptions<Entity>;

  constructor(parsedQuery: TCommonGetManyOptions) {
    this._findOptions = {
      ...this.getPaginationOptions(parsedQuery.pagination),
      // TODO: remove any type
      where: parsedQuery.filters as any,
    };
  }

  get getFindOptions() {
    return this._findOptions;
  }

  private getPaginationOptions(
    paginationOptions?: TCommonPagination,
  ): FindManyOptions<Entity> {
    const take = paginationOptions?.itemsPerPage;
    const skip =
      paginationOptions?.pageNumber && paginationOptions.itemsPerPage
        ? (paginationOptions.pageNumber - 1) * paginationOptions.itemsPerPage
        : 0;
    return {
      take,
      skip,
    };
  }
}
