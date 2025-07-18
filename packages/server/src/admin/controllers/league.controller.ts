import { inject, injectable } from "inversify";
import { AdminLeagueService } from "@way-to-bot/server/admin/services/league.service";
import {
  AdminDTOLeagueCreateResponse,
  AdminDTOLeagueDeleteResponse,
  AdminDTOLeagueGetMany,
  AdminDTOLeagueGetManyResponse,
  AdminDTOLeagueGetOne,
  AdminDTOLeagueGetOneResponse,
  AdminDTOLeagueUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/league.DTO";
import { Request, Response } from "express";

@injectable()
export class AdminLeagueController {
  constructor(
    @inject(AdminLeagueService)
    private readonly _leagueService: AdminLeagueService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options = req.getManyOptions;
    const result = await this._leagueService.getMany(options);
    const data = new AdminDTOLeagueGetManyResponse(
      result.data.map((i) => new AdminDTOLeagueGetMany(i)),
      {
        limit: options?.pagination?.limit,
        offset: options?.pagination?.offset,
        totalRows: result.count,
      },
    );

    res.status(200).send(data);
  }

  async getOne(req: Request, res: Response) {
    const result = await this._leagueService.getOne(+req.params.id!);
    const data = new AdminDTOLeagueGetOneResponse(
      new AdminDTOLeagueGetOne(result),
    );
    res.status(200).send(data);
  }

  async create(req: Request, res: Response) {
    const result = await this._leagueService.create(req.body);
    const data = new AdminDTOLeagueCreateResponse(
      new AdminDTOLeagueGetOne(result),
    );
    res.status(201).send(data);
  }

  async update(req: Request, res: Response) {
    const result = await this._leagueService.update(+req.params.id!, req.body);
    const data = new AdminDTOLeagueUpdateResponse(
      new AdminDTOLeagueGetOne(result),
    );
    res.status(200).send(data);
  }

  async delete(req: Request, res: Response) {
    const result = await this._leagueService.delete(+req.params.id!);
    const data = new AdminDTOLeagueDeleteResponse(result);
    res.status(200).send(data);
  }
}
