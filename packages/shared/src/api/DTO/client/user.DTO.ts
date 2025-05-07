import { GetManyWithPaginationDTO } from "@way-to-bot/shared/api/DTO/common/get-many-with-pagination.DTO.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { IPagination } from "@way-to-bot/shared/api/interfaces/pagination.interface.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";
import { BaseDTOUser } from "@way-to-bot/shared/api/DTO/base/user.DTO.js";
import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { IEventLeagueUserEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-user-entity.interface.js";

// response DTO
export class ClientDTOUserGetManyResponse extends GetManyWithPaginationDTO<ClientDTOUserGetMany> {
  constructor(data: ClientDTOUserGetMany[], pagination: IPagination) {
    super(data, pagination);
  }
}

export class ClientDTOUserGetOneResponse extends GetOneDTO<ClientDTOUserGetOne> {
  constructor(data: ClientDTOUserGetOne) {
    super(data);
  }
}

export class ClientDTOUserCreateResponse extends GetOneDTO<ClientDTOUserGetOne> {
  constructor(data: ClientDTOUserGetOne) {
    super(data);
  }
}

export class ClientDTOUserUpdateResponse extends GetOneDTO<ClientDTOUserGetOne> {
  constructor(data: ClientDTOUserGetOne) {
    super(data);
  }
}

// returning data DTO
export class ClientDTOUserGetMany extends BaseDTOUser {
  constructor(data: IUserEntity) {
    super(data);
  }
}

export class ClientDTOUserGetOne extends BaseDTOUser {
  events: (IEventEntity & { points: number | undefined | null })[];
  constructor(data: IUserEntity) {
    super(data);
    this.events = data.eventLeagues
      ? this.generateEventsList(data.eventLeagues)
      : [];
  }

  private generateEventsList(eventLeagues: IEventLeagueUserEntity[]) {
    return eventLeagues.flatMap((elu) => {
      return { ...elu.eventLeague.event, points: elu.points };
    });
  }
}
