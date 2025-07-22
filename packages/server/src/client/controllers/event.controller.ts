import { inject, injectable } from "inversify";
import { ClientEventService } from "@way-to-bot/server/client/services/event.service";
import {
  ClientDTOEventGetMany,
  ClientDTOEventGetManyResponse,
  ClientDTOEventGetOne,
  ClientDTOEventGetOneResponse,
} from "@way-to-bot/shared/api/DTO/client/event.DTO";
import { Request, Response } from "express";

@injectable()
export class ClientEventController {
  constructor(
    @inject(ClientEventService)
    private readonly _eventService: ClientEventService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options = req.getManyOptions;
    const result = await this._eventService.getMany(options);
    const data = new ClientDTOEventGetManyResponse(
      result.data.map((i) => new ClientDTOEventGetMany(i)),
      {
        limit: options?.pagination?.limit,
        offset: options?.pagination?.offset,
        totalRows: result.count,
      },
    );

    res.status(200).send(data);
  }

  async getById(req: Request, res: Response) {
    const id = +req.params.id!;
    const result = await this._eventService.getById(id);
    const data = new ClientDTOEventGetOneResponse(
      new ClientDTOEventGetOne(result),
    );

    res.status(200).send(data);
  }
}
