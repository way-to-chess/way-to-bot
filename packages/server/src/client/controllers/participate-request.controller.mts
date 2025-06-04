import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { ClientParticipateRequestService } from "@way-to-bot/server/client/services/participate-request.service.mjs";
import {
  TClientParticipateRequestCreatePayload,
  TClientParticipateRequestUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/participate-request.schema.js";
import {
  ClientDTOParticipateRequestCreateResponse,
  ClientDTOParticipateRequestDeleteResponse,
  ClientDTOParticipateRequestGetMany,
  ClientDTOParticipateRequestGetManyResponse,
  ClientDTOParticipateRequestGetOne,
  ClientDTOParticipateRequestGetOneResponse,
  ClientDTOParticipateRequestUpdateResponse,
} from "@way-to-bot/shared/api/DTO/client/participate-request.DTO.js";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";

@injectable()
export class ClientParticipateRequestController {
  constructor(
    @inject(ClientParticipateRequestService)
    private readonly _participateRequestService: ClientParticipateRequestService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options =
      req.getManyOptions as GetManyOptionsDTO<ParticipateRequestEntity>;
    const result = await this._participateRequestService.getMany(
      req.user!.id,
      options,
    );
    const data = new ClientDTOParticipateRequestGetManyResponse(
      result.data.map((i) => new ClientDTOParticipateRequestGetMany(i)),
      {
        limit: options?.getFindOptions?.take,
        offset: options?.getFindOptions?.skip,
        totalRows: result.count,
      },
    );

    res.status(200).send(data);
  }

  async getById(req: Request, res: Response) {
    const result = await this._participateRequestService.getById(
      +req.params.id!,
    );
    const data = new ClientDTOParticipateRequestGetOneResponse(
      new ClientDTOParticipateRequestGetOne(result),
    );
    res.status(200).send(data);
  }

  async create(req: Request, res: Response) {
    const result = await this._participateRequestService.create({
      ...req.body,
      userId: req.user!.id,
    });
    const data = new ClientDTOParticipateRequestCreateResponse(
      new ClientDTOParticipateRequestGetOne(result),
    );
    res.status(201).send(data);
  }

  async update(req: Request, res: Response) {
    const result = await this._participateRequestService.update(
      +req.params.id!,
      req.body,
    );
    const data = new ClientDTOParticipateRequestUpdateResponse(
      new ClientDTOParticipateRequestGetOne(result),
    );
    res.status(200).send(data);
  }

  async delete(req: Request, res: Response) {
    const result = await this._participateRequestService.delete(
      +req.params.id!,
    );
    const data = new ClientDTOParticipateRequestDeleteResponse(result);
    res.status(200).send(data);
  }
}
