import { GetManyWithPaginationDTO } from "@way-to-bot/shared/api/DTO/common/get-many-with-pagination.DTO.js";
import { IPagination } from "@way-to-bot/shared/api/interfaces/pagination.interface.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";
import { DeleteDTO } from "@way-to-bot/shared/api/DTO/common/delete.DTO.js";
import { BaseDTOParticipateRequest } from "@way-to-bot/shared/api/DTO/base/participate-request.DTO.js";
import { IParticipateRequestEntity } from "@way-to-bot/shared/api/interfaces/entities/participate-request-entity.interface.js";

// response DTO
export class AdminDTOParticipateRequestGetManyResponse extends GetManyWithPaginationDTO<AdminDTOParticipateRequestGetMany> {
  constructor(
    data: AdminDTOParticipateRequestGetMany[],
    pagination: IPagination,
  ) {
    super(data, pagination);
  }
}

export class AdminDTOParticipateRequestGetOneResponse extends GetOneDTO<AdminDTOParticipateRequestGetOne> {
  constructor(data: AdminDTOParticipateRequestGetOne) {
    super(data);
  }
}

export class AdminDTOParticipateRequestUpdateResponse extends GetOneDTO<AdminDTOParticipateRequestGetOne> {
  constructor(data: AdminDTOParticipateRequestGetOne) {
    super(data);
  }
}

export class AdminDTOParticipateRequestDeleteResponse extends DeleteDTO {
  constructor(data: boolean) {
    super(data);
  }
}

// returning data DTO
export class AdminDTOParticipateRequestGetMany extends BaseDTOParticipateRequest {
  constructor(data: IParticipateRequestEntity) {
    super(data);
  }
}

export class AdminDTOParticipateRequestGetOne extends BaseDTOParticipateRequest {
  constructor(data: IParticipateRequestEntity) {
    super(data);
  }
}
