import { BaseDTOLeague } from "@way-to-bot/shared/api/DTO/base/league.DTO.js";
import { ILeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/league-entity.interface.js";
import { IPagination } from "@way-to-bot/shared/api/interfaces/pagination.interface.js";
import { GetManyWithPaginationDTO } from "@way-to-bot/shared/api/DTO/common/get-many-with-pagination.DTO.js";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO.js";
import { DeleteDTO } from "@way-to-bot/shared/api/DTO/common/delete.DTO.js";

// response DTO
export class AdminDTOLeagueGetManyResponse extends GetManyWithPaginationDTO<AdminDTOLeagueGetMany> {
  constructor(data: AdminDTOLeagueGetMany[], pagination: IPagination) {
    super(data, pagination);
  }
}

export class AdminDTOLeagueGetOneResponse extends GetOneDTO<AdminDTOLeagueGetOne> {
  constructor(data: AdminDTOLeagueGetOne) {
    super(data);
  }
}

export class AdminDTOLeagueCreateResponse extends GetOneDTO<AdminDTOLeagueGetOne> {
  constructor(data: AdminDTOLeagueGetOne) {
    super(data);
  }
}

export class AdminDTOLeagueUpdateResponse extends GetOneDTO<AdminDTOLeagueGetOne> {
  constructor(data: AdminDTOLeagueGetOne) {
    super(data);
  }
}

export class AdminDTOLeagueDeleteResponse extends DeleteDTO {
  constructor(data: boolean) {
    super(data);
  }
}

// returning data DTO
export class AdminDTOLeagueGetMany extends BaseDTOLeague {
  constructor(data: ILeagueEntity) {
    super(data);
  }
}

export class AdminDTOLeagueGetOne extends BaseDTOLeague {
  constructor(data: ILeagueEntity) {
    super(data);
  }
}
