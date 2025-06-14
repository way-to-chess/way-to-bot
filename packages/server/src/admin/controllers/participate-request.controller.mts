import { inject, injectable } from "inversify";
import { AdminParticipateRequestService } from "@way-to-bot/server/admin/services/participate-request.service.mjs";
import {
  AdminDTOParticipateRequestGetMany,
  AdminDTOParticipateRequestGetManyResponse,
  AdminDTOParticipateRequestGetOne,
  AdminDTOParticipateRequestUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/participate-request.DTO.js";
import { Request, Response } from "express";

@injectable()
export class AdminParticipateRequestController {
  constructor(
    @inject(AdminParticipateRequestService)
    private readonly _participateRequestService: AdminParticipateRequestService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options = req.getManyOptions;
    const result = await this._participateRequestService.getMany(options);
    const data = new AdminDTOParticipateRequestGetManyResponse(
      result.data.map((i) => new AdminDTOParticipateRequestGetMany(i)),
      {
        limit: options?.pagination?.limit,
        offset: options?.pagination?.offset,
        totalRows: result.count,
      },
    );

    res.status(200).send(data);
  }

  async update(req: Request, res: Response) {
    const result =
      await this._participateRequestService.updateParticipateRequest(
        +req.params.id!,
        req.body,
      );
    const data = new AdminDTOParticipateRequestUpdateResponse(
      new AdminDTOParticipateRequestGetOne(result),
    );
    res.status(200).send(data);
  }
}
