import { inject, injectable } from "inversify";
import { AdminEventService } from "@way-to-bot/server/admin/services/event.service.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import {
  AdminDTOEventCreateResponse,
  AdminDTOEventDeleteResponse,
  AdminDTOEventGetMany,
  AdminDTOEventGetManyResponse,
  AdminDTOEventGetOne,
  AdminDTOEventGetOneResponse,
  AdminDTOEventUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/event.DTO.js";
import { Request, Response } from "express";

@injectable()
export class AdminEventController {
  constructor(
    @inject(AdminEventService)
    private readonly _eventService: AdminEventService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options = req.getManyOptions as GetManyOptionsDTO<EventEntity>;
    const result = await this._eventService.getMany(options);
    const data = new AdminDTOEventGetManyResponse(
      result.data.map((i) => new AdminDTOEventGetMany(i)),
      {
        limit: options?.getFindOptions?.take,
        offset: options?.getFindOptions?.skip,
        totalRows: result.count,
      },
    );
    res.status(200).send(data);
  }

  async getById(req: Request, res: Response) {
    const result = await this._eventService.getById(+req.params.id!);
    const data = new AdminDTOEventGetOneResponse(
      new AdminDTOEventGetOne(result),
    );
    res.status(200).send(data);
  }

  async create(req: Request, res: Response) {
    const result = await this._eventService.create(req.body);
    const data = new AdminDTOEventCreateResponse(
      new AdminDTOEventGetOne(result),
    );
    res.status(201).send(data);
  }

  async update(req: Request, res: Response) {
    const result = await this._eventService.update(+req.params.id!, req.body);
    const data = new AdminDTOEventUpdateResponse(
      new AdminDTOEventGetOne(result),
    );
    res.status(200).send(data);
  }

  async delete(req: Request, res: Response) {
    const result = await this._eventService.delete(+req.params.id!);
    const data = new AdminDTOEventDeleteResponse(result);
    res.status(200).send(data);
  }
}
