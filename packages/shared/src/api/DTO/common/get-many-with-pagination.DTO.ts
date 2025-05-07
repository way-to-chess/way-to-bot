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
  pageNumber: number;
  itemsPerPage?: number;
  pagesTotal: number;

  constructor(pagination: IPagination) {
    this.itemsPerPage = pagination.itemsPerPage;
    this.pageNumber = pagination.pageNumber || 1;
    this.pagesTotal = this.getTotalPages(pagination.totalRows);
  }

  private getTotalPages(totalRows: number) {
    if (!totalRows || !this.itemsPerPage) {
      return 1;
    }

    return Math.ceil(totalRows / this.itemsPerPage);
  }
}
