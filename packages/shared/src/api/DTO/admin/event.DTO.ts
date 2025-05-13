import { BaseDTOEvent } from "@way-to-bot/shared/api/DTO/base/event.DTO.js";
import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";
import { GetManyWithPaginationDTO } from "@way-to-bot/shared/api/DTO/common/get-many-with-pagination.DTO.js";
import { IPagination } from "@way-to-bot/shared/api/interfaces/pagination.interface.js";
import { DeleteDTO } from "@way-to-bot/shared/api/DTO/common/delete.DTO.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { IEventLeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-entity.interface.js";

// response DTO
export class AdminDTOEventGetManyResponse extends GetManyWithPaginationDTO<AdminDTOEventGetMany> {
  constructor(data: AdminDTOEventGetMany[], pagination: IPagination) {
    super(data, pagination);
  }
}

export class AdminDTOEventGetOneResponse extends GetOneDTO<AdminDTOEventGetOne> {
  constructor(data: AdminDTOEventGetOne) {
    super(data);
  }
}

export class AdminDTOEventCreateResponse extends GetOneDTO<AdminDTOEventGetOne> {
  constructor(data: AdminDTOEventGetOne) {
    super(data);
  }
}

export class AdminDTOEventUpdateResponse extends GetOneDTO<AdminDTOEventGetOne> {
  constructor(data: AdminDTOEventGetOne) {
    super(data);
  }
}

export class AdminDTOEventDeleteResponse extends DeleteDTO {
  constructor(data: boolean) {
    super(data);
  }
}

// returning data DTO
export class AdminDTOEventGetMany extends BaseDTOEvent {
  readonly participantsCount: number;
  constructor(data: IEventEntity) {
    super(data);
    this.participantsCount = this.countParticipants(data.eventLeagues ?? []);
  }

  countParticipants(eventLeagues: IEventLeagueEntity[]) {
    return eventLeagues.reduce((pr, curr) => {
      if (curr.participants?.length) {
        pr += curr.participants.length;
      }
      return pr;
    }, 0);
  }
}

export class AdminDTOEventGetOne extends BaseDTOEvent {
  readonly users: IUserEntity[];

  constructor(data: IEventEntity) {
    super(data);
    this.users = this.generateUsersList(data.eventLeagues ?? []);
  }
  private generateUsersList(eventLeagues: IEventLeagueEntity[]) {
    return eventLeagues.flatMap(
      (el) => el.participants?.map((elu) => elu.user) || [],
    );
  }
}
