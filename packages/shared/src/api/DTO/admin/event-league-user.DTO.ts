import { BaseDTOEventLeagueUser } from "@way-to-bot/shared/api/DTO/base/event-league-user.DTO.js";
import { IEventLeagueUserEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-user-entity.interface.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";
import { DeleteDTO } from "@way-to-bot/shared/api/DTO/common/delete.DTO.js";

// response DTO
export class AdminDTOEventLeagueUserCreateResponse extends GetOneDTO<AdminDTOEventLeagueUserGetOne> {
  constructor(data: AdminDTOEventLeagueUserGetOne) {
    super(data);
  }
}

export class AdminDTOEventLeagueUserUpdateResponse extends GetOneDTO<AdminDTOEventLeagueUserGetOne> {
  constructor(data: AdminDTOEventLeagueUserGetOne) {
    super(data);
  }
}

export class AdminDTOEventLeagueUserDeleteResponse extends DeleteDTO {
  constructor(data: boolean) {
    super(data);
  }
}

// returning data DTO
export class AdminDTOEventLeagueUserGetOne extends BaseDTOEventLeagueUser {
  constructor(data: IEventLeagueUserEntity) {
    super(data);
  }
}
