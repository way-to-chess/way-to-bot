import { BaseDTOParticipateRequest } from "@way-to-bot/shared/api/DTO/base/participate-request.DTO.js";
import { IParticipateRequestEntity } from "@way-to-bot/shared/api/interfaces/entities/participate-request-entity.interface.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";
import { DeleteDTO } from "@way-to-bot/shared/api/DTO/common/delete.DTO.js";

// response DTO
export class ClientDTOParticipateRequestGetOneResponse extends GetOneDTO<ClientDTOParticipateRequestGetOne> {
  constructor(data: ClientDTOParticipateRequestGetOne) {
    super(data);
  }
}

export class ClientDTOParticipateRequestCreateResponse extends GetOneDTO<ClientDTOParticipateRequestGetOne> {
  constructor(data: ClientDTOParticipateRequestGetOne) {
    super(data);
  }
}

export class ClientDTOParticipateRequestUpdateResponse extends GetOneDTO<ClientDTOParticipateRequestGetOne> {
  constructor(data: ClientDTOParticipateRequestGetOne) {
    super(data);
  }
}

export class ClientDTOParticipateRequestDeleteResponse extends DeleteDTO {
  constructor(data: boolean) {
    super(data);
  }
}

// returning data DTO
export class ClientDTOParticipateRequestGetOne extends BaseDTOParticipateRequest {
  constructor(data: IParticipateRequestEntity) {
    super(data);
  }
}
