import { BaseDTOUser } from "@way-to-bot/shared/api/DTO/base/user.DTO.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { IEventLeagueUserEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-user-entity.interface.js";
import { GetManyWithPaginationDTO } from "@way-to-bot/shared/api/DTO/common/get-many-with-pagination.DTO.js";
import { IPagination } from "@way-to-bot/shared/api/interfaces/pagination.interface.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";
import { DeleteDTO } from "@way-to-bot/shared/api/DTO/common/delete.DTO.js";

// response DTO
export class AdminDTOUserGetManyResponse extends GetManyWithPaginationDTO<AdminDTOUserGetMany> {
  constructor(data: AdminDTOUserGetMany[], pagination: IPagination) {
    super(data, pagination);
  }
}

export class AdminDTOUserGetOneResponse extends GetOneDTO<AdminDTOUserGetOne> {
  constructor(data: AdminDTOUserGetOne) {
    super(data);
  }
}

export class AdminDTOUserCreateResponse extends GetOneDTO<AdminDTOUserGetOne> {
  constructor(data: AdminDTOUserGetOne) {
    super(data);
  }
}

export class AdminDTOUserUpdateResponse extends GetOneDTO<AdminDTOUserGetOne> {
  constructor(data: AdminDTOUserGetOne) {
    super(data);
  }
}

export class AdminDTOUserDeleteResponse extends DeleteDTO {
  constructor(data: boolean) {
    super(data);
  }
}

// returning data DTO
export class AdminDTOUserGetMany extends BaseDTOUser {
  constructor(data: IUserEntity) {
    super(data);
  }
}

export class AdminDTOUserGetOne extends BaseDTOUser {
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
