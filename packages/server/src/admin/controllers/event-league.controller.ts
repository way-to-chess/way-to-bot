import { inject, injectable } from "inversify";
import { AdminEventLeagueService } from "@way-to-bot/server/admin/services/event-league.service.mjs";
import {
  TAdminEventLeagueCreatePayload,
  TAdminEventLeagueUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/event-league.schema.js";
import {
  AdminDTOEventLeagueCreateResponse,
  AdminDTOEventLeagueDeleteResponse,
  AdminDTOEventLeagueGetOne,
  AdminDTOEventLeagueUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/event-league.DTO.js";
import { AdminEventLeagueUserService } from "@way-to-bot/server/admin/services/event-league-user.service.mjs";

@injectable()
export class AdminEventLeagueController {
  constructor(
    @inject(AdminEventLeagueService)
    private readonly _eventLeagueService: AdminEventLeagueService,
    @inject(AdminEventLeagueUserService)
    private readonly _adminEventLeagueUserService: AdminEventLeagueUserService,
  ) {}

  async create(payload: TAdminEventLeagueCreatePayload) {
    const data = await this._eventLeagueService.create(payload);
    return new AdminDTOEventLeagueCreateResponse(
      new AdminDTOEventLeagueGetOne(data),
    );
  }

  async delete(id: number) {
    const data = await this._eventLeagueService.delete(id);
    return new AdminDTOEventLeagueDeleteResponse(data);
  }

  async updateEventLeagueParticipantsList(
    id: number,
    payload: TAdminEventLeagueUserUpdatePayload,
  ) {
    const data =
      await this._adminEventLeagueUserService.updateEventLeagueUsersList(
        id,
        payload,
      );

    return new AdminDTOEventLeagueUpdateResponse(
      new AdminDTOEventLeagueGetOne(data),
    );
  }
}
