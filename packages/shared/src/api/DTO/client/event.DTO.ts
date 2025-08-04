import { BaseDTOEvent } from "@way-to-bot/shared/api/DTO/base/event.DTO.js";
import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { GetManyWithPaginationDTO } from "@way-to-bot/shared/api/DTO/common/get-many-with-pagination.DTO.js";
import { IPagination } from "@way-to-bot/shared/api/interfaces/pagination.interface.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";

// response DTO
export class ClientDTOEventGetManyResponse extends GetManyWithPaginationDTO<ClientDTOEventGetMany> {
  constructor(data: ClientDTOEventGetMany[], pagination: IPagination) {
    super(data, pagination);
  }
}

export class ClientDTOEventGetOneResponse extends GetOneDTO<ClientDTOEventGetOne> {
  constructor(data: ClientDTOEventGetOne) {
    super(data);
  }
}

// returning data DTO
export class ClientDTOEventGetMany extends BaseDTOEvent {
  constructor(data: IEventEntity) {
    super(data);
  }
}

export class ClientDTOEventGetOne extends BaseDTOEvent {
  constructor(data: IEventEntity) {
    super(data);
  }
}
