import { BaseDTOLocation } from "@way-to-bot/shared/api/DTO/base/location.DTO.js";
import { ILocationEntity } from "@way-to-bot/shared/api/interfaces/entities/location-entity.interface.js";
import { GetManyWithPaginationDTO } from "@way-to-bot/shared/api/DTO/common/get-many-with-pagination.DTO.js";
import { IPagination } from "@way-to-bot/shared/api/interfaces/pagination.interface.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";
import { DeleteDTO } from "@way-to-bot/shared/api/DTO/common/delete.DTO.js";

// response DTO
export class AdminDTOLocationGetManyResponse extends GetManyWithPaginationDTO<AdminDTOLocationGetMany> {
  constructor(data: AdminDTOLocationGetMany[], pagination: IPagination) {
    super(data, pagination);
  }
}

export class AdminDTOLocationGetOneResponse extends GetOneDTO<AdminDTOLocationGetOne> {
  constructor(data: AdminDTOLocationGetOne) {
    super(data);
  }
}

export class AdminDTOLocationCreateResponse extends GetOneDTO<AdminDTOLocationGetOne> {
  constructor(data: AdminDTOLocationGetOne) {
    super(data);
  }
}

export class AdminDTOLocationUpdateResponse extends GetOneDTO<AdminDTOLocationGetOne> {
  constructor(data: AdminDTOLocationGetOne) {
    super(data);
  }
}

export class AdminDTOLocationDeleteResponse extends DeleteDTO {
  constructor(data: boolean) {
    super(data);
  }
}

// returning data DTO
export class AdminDTOLocationGetMany extends BaseDTOLocation {
  constructor(data: ILocationEntity) {
    super(data);
  }
}

export class AdminDTOLocationGetOne extends BaseDTOLocation {
  constructor(data: ILocationEntity) {
    super(data);
  }
}
