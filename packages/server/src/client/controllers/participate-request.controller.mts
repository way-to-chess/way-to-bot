import { inject, injectable } from "inversify";
import { ClientParticipateRequestService } from "@way-to-bot/server/client/services/participate-request.service.mjs";
import {
  TClientParticipateRequestCreatePayload,
  TClientParticipateRequestUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/participate-request.schema.js";
import {
  ClientDTOParticipateRequestCreateResponse,
  ClientDTOParticipateRequestDeleteResponse,
  ClientDTOParticipateRequestGetOne,
  ClientDTOParticipateRequestGetOneResponse,
  ClientDTOParticipateRequestUpdateResponse,
} from "@way-to-bot/shared/api/DTO/client/participate-request.DTO.js";

@injectable()
export class ClientParticipateRequestController {
  constructor(
    @inject(ClientParticipateRequestService)
    private readonly _participateRequestService: ClientParticipateRequestService,
  ) {}

  async getById(id: number) {
    const data = await this._participateRequestService.getById(id);
    return new ClientDTOParticipateRequestGetOneResponse(
      new ClientDTOParticipateRequestGetOne(data),
    );
  }

  async create(payload: TClientParticipateRequestCreatePayload) {
    const data = await this._participateRequestService.create(payload);
    return new ClientDTOParticipateRequestCreateResponse(
      new ClientDTOParticipateRequestGetOne(data),
    );
  }

  async update(id: number, payload: TClientParticipateRequestUpdatePayload) {
    const data = await this._participateRequestService.update(id, payload);
    return new ClientDTOParticipateRequestUpdateResponse(
      new ClientDTOParticipateRequestGetOne(data),
    );
  }

  async delete(id: number) {
    const data = await this._participateRequestService.delete(id);
    return new ClientDTOParticipateRequestDeleteResponse(data);
  }
}
