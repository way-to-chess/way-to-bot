import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { ClientParticipateRequestService } from "@way-to-bot/server/client/services/participate-request.service";
import {
  ClientDTOParticipateRequestCreateResponse,
  ClientDTOParticipateRequestDeleteResponse,
  ClientDTOParticipateRequestGetMany,
  ClientDTOParticipateRequestGetManyResponse,
  ClientDTOParticipateRequestGetOne,
  ClientDTOParticipateRequestGetOneResponse,
  ClientDTOParticipateRequestUpdateResponse,
} from "@way-to-bot/shared/api/DTO/client/participate-request.DTO";

@injectable()
export class ClientParticipateRequestController {
  constructor(
    @inject(ClientParticipateRequestService)
    private readonly _participateRequestService: ClientParticipateRequestService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options = req.getManyOptions;
    const result = await this._participateRequestService.getMany(
      req.user!.id,
      options,
    );
    const data = new ClientDTOParticipateRequestGetManyResponse(
      result.data.map((i) => new ClientDTOParticipateRequestGetMany(i)),
      {
        limit: options?.pagination?.limit,
        offset: options?.pagination?.offset,
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
    }, req.user!.tgId);
    const data = new ClientDTOParticipateRequestCreateResponse(
      new ClientDTOParticipateRequestGetOne(result),
    );
    res.status(201).send(data);
  }

  async delete(req: Request, res: Response) {
    const result = await this._participateRequestService.delete(
      +req.params.id!,
    );
    const data = new ClientDTOParticipateRequestDeleteResponse(result);
    res.status(200).send(data);
  }
}
