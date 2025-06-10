import { inject, injectable } from "inversify";
import { AdminLocationService } from "@way-to-bot/server/admin/services/location.service.mjs";
import {
  AdminDTOLocationCreateResponse,
  AdminDTOLocationDeleteResponse,
  AdminDTOLocationGetMany,
  AdminDTOLocationGetManyResponse,
  AdminDTOLocationGetOne,
  AdminDTOLocationGetOneResponse,
  AdminDTOLocationUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/location.DTO.js";
import { Request, Response } from "express";

@injectable()
export class AdminLocationController {
  constructor(
    @inject(AdminLocationService)
    private readonly _locationService: AdminLocationService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options = req.getManyOptions;
    const result = await this._locationService.getMany(options);
    const data = new AdminDTOLocationGetManyResponse(
      result.data.map((i) => new AdminDTOLocationGetMany(i)),
      {
        limit: options?.pagination?.limit,
        offset: options?.pagination?.offset,
        totalRows: result.count,
      },
    );

    res.status(200).send(data);
  }

  async getOne(req: Request, res: Response) {
    const result = await this._locationService.getOne(+req.params.id!);
    const data = new AdminDTOLocationGetOneResponse(
      new AdminDTOLocationGetOne(result),
    );
    res.status(200).send(data);
  }

  async create(req: Request, res: Response) {
    const result = await this._locationService.create(req.body);
    const data = new AdminDTOLocationCreateResponse(
      new AdminDTOLocationGetOne(result),
    );
    res.status(201).send(data);
  }

  async update(req: Request, res: Response) {
    const result = await this._locationService.update(
      +req.params.id!,
      req.body,
    );
    const data = new AdminDTOLocationUpdateResponse(
      new AdminDTOLocationGetOne(result),
    );
    res.status(200).send(data);
  }

  async delete(req: Request, res: Response) {
    const result = await this._locationService.delete(+req.params.id!);
    const data = new AdminDTOLocationDeleteResponse(result);
    res.status(200).send(data);
  }
}
