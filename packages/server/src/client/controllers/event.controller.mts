import { inject, injectable } from "inversify";
import { ClientEventService } from "@way-to-bot/server/client/services/event.service.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import {
  ClientDTOEventGetMany,
  ClientDTOEventGetManyResponse,
  ClientDTOEventGetOne,
  ClientDTOEventGetOneResponse,
} from "@way-to-bot/shared/api/DTO/client/event.DTO.js";
import { Request, Response } from "express";

@injectable()
export class ClientEventController {
  constructor(
    @inject(ClientEventService)
    private readonly _eventService: ClientEventService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options = req.getManyOptions as GetManyOptionsDTO<EventEntity>;
    const result = await this._eventService.getMany(options);
    const data = new ClientDTOEventGetManyResponse(
      result.data.map((i) => new ClientDTOEventGetMany(i)),
      {
        limit: options?.getFindOptions?.take,
        offset: options?.getFindOptions?.skip,
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
