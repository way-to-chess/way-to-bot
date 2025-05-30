import { IPagination } from "@way-to-bot/shared/api/interfaces/pagination.interface.js";

export abstract class GetManyWithPaginationDTO<T> {
  data: T[];
  pagination: PaginationDTO;

  protected constructor(data: T[], pagination: IPagination) {
    this.data = data;
    this.pagination = new PaginationDTO(pagination);
  }
}

class PaginationDTO {
  limit?: number;
  offset?: number;
  totalRows: number;

  constructor(pagination: IPagination) {
    this.limit = pagination.limit;
    this.offset = pagination.offset;
    this.totalRows = pagination.totalRows;
  }
}
