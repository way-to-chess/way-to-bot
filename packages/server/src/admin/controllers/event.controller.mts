import { inject, injectable } from "inversify";
import { AdminEventService } from "@way-to-bot/server/admin/services/event.service.mjs";
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
    const options = req.getManyOptions;
    const result = await this._eventService.getMany(options);
    const data = new AdminDTOEventGetManyResponse(
      result.data.map((i) => new AdminDTOEventGetMany(i)),
      {
        limit: options?.pagination?.limit,
        offset: options?.pagination?.offset,
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
