import { IEventLeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-entity.interface.js";
import { BaseDTOEventLeague } from "@way-to-bot/shared/api/DTO/base/event-league.DTO.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";
import { DeleteDTO } from "@way-to-bot/shared/api/DTO/common/delete.DTO.js";

// response DTO
export class AdminDTOEventLeagueCreateResponse extends GetOneDTO<AdminDTOEventLeagueGetOne> {
  constructor(data: AdminDTOEventLeagueGetOne) {
    super(data);
  }
}

export class AdminDTOEventLeagueUpdateResponse extends GetOneDTO<AdminDTOEventLeagueGetOne> {
  constructor(data: AdminDTOEventLeagueGetOne) {
    super(data);
  }
}

export class AdminDTOEventLeagueDeleteResponse extends DeleteDTO {
  constructor(data: boolean) {
    super(data);
  }
}

// returning data DTO
export class AdminDTOEventLeagueGetOne extends BaseDTOEventLeague {
  constructor(data: IEventLeagueEntity) {
    super(data);
  }
}
