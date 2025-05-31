import { inject, injectable } from "inversify";
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
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";

@injectable()
export class ClientParticipateRequestController {
  constructor(
    @inject(ClientParticipateRequestService)
    private readonly _participateRequestService: ClientParticipateRequestService,
  ) {}

  async getMany(
    userId: number,
    options?: GetManyOptionsDTO<ParticipateRequestEntity>,
  ) {
    const data = await this._participateRequestService.getMany(userId, options);
    return new ClientDTOParticipateRequestGetManyResponse(
      data.data.map((i) => new ClientDTOParticipateRequestGetMany(i)),
      {
        limit: options?.getFindOptions?.take,
        offset: options?.getFindOptions?.skip,
        totalRows: data.count,
      },
    );
  }

  async getById(id: number) {
    const data = await this._participateRequestService.getById(id);
    return new ClientDTOParticipateRequestGetOneResponse(
      new ClientDTOParticipateRequestGetOne(data),
    );
  }

  async create(
    userId: number,
    payload: TClientParticipateRequestCreatePayload,
  ) {
    const data = await this._participateRequestService.create({
      ...payload,
      userId,
    });
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
