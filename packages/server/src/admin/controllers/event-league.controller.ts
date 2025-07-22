import { inject, injectable } from "inversify";
import { AdminEventLeagueService } from "@way-to-bot/server/admin/services/event-league.service";
import {
  AdminDTOEventLeagueCreateResponse,
  AdminDTOEventLeagueDeleteResponse,
  AdminDTOEventLeagueGetOne,
  AdminDTOEventLeagueUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/event-league.DTO";
import { AdminEventLeagueUserService } from "@way-to-bot/server/admin/services/event-league-user.service";
import { Request, Response } from "express";

@injectable()
export class AdminEventLeagueController {
  constructor(
    @inject(AdminEventLeagueService)
    private readonly _eventLeagueService: AdminEventLeagueService,
    @inject(AdminEventLeagueUserService)
    private readonly _adminEventLeagueUserService: AdminEventLeagueUserService,
  ) {}

  async create(req: Request, res: Response) {
    const result = await this._eventLeagueService.create(req.body);
    const data = new AdminDTOEventLeagueCreateResponse(
      new AdminDTOEventLeagueGetOne(result),
    );
    res.status(200).send(data);
  }

  async delete(req: Request, res: Response) {
    const result = await this._eventLeagueService.delete(+req.params.id!);
    const data = new AdminDTOEventLeagueDeleteResponse(result);
    res.status(200).send(data);
  }

  async updateEventLeagueParticipantsList(req: Request, res: Response) {
    const result =
      await this._adminEventLeagueUserService.updateEventLeagueUsersList(
        +req.params.id!,
        req.body,
      );
    const data = new AdminDTOEventLeagueUpdateResponse(
      new AdminDTOEventLeagueGetOne(result),
    );
    res.status(200).send(data);
  }
}
