import { inject, injectable } from "inversify";
import { AdminLeagueService } from "@way-to-bot/server/admin/services/league.service.mjs";
import {
  TAdminLeagueCreatePayload,
  TAdminLeagueUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/league.schema.js";
import { LeagueEntity } from "@way-to-bot/server/database/entities/league.entity.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import {
  AdminDTOLeagueCreateResponse,
  AdminDTOLeagueDeleteResponse,
  AdminDTOLeagueGetMany,
  AdminDTOLeagueGetManyResponse,
  AdminDTOLeagueGetOne,
  AdminDTOLeagueGetOneResponse,
  AdminDTOLeagueUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/league.DTO.js";

@injectable()
export class AdminLeagueController {
  constructor(
    @inject(AdminLeagueService)
    private readonly _leagueService: AdminLeagueService,
  ) {}

  async getMany(options?: GetManyOptionsDTO<LeagueEntity>) {
    const data = await this._leagueService.getMany(options);
    return new AdminDTOLeagueGetManyResponse(
      data.data.map((i) => new AdminDTOLeagueGetMany(i)),
      {
        itemsPerPage: options?.getFindOptions?.take,
        pageNumber: options?.getFindOptions?.skip,
        totalRows: data.count,
      },
    );
  }

  async getOne(id: number) {
    const data = await this._leagueService.getOne(id);
    return new AdminDTOLeagueGetOneResponse(new AdminDTOLeagueGetOne(data));
  }

  async create(payload: TAdminLeagueCreatePayload) {
    const data = await this._leagueService.create(payload);
    return new AdminDTOLeagueCreateResponse(new AdminDTOLeagueGetOne(data));
  }

  async update(id: number, payload: TAdminLeagueUpdatePayload) {
    const data = await this._leagueService.update(id, payload);
    return new AdminDTOLeagueUpdateResponse(new AdminDTOLeagueGetOne(data));
  }

  async delete(id: number) {
    const data = await this._leagueService.delete(id);
    return new AdminDTOLeagueDeleteResponse(data);
  }
}
