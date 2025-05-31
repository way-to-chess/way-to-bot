import { inject, injectable } from "inversify";
import { ParticipateRequestRepository } from "@way-to-bot/server/database/repositories/participate-request.repository.mjs";
import {
  TClientParticipateRequestCreatePayload,
  TClientParticipateRequestUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/participate-request.schema.js";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";

@injectable()
export class ClientParticipateRequestService {
  constructor(
    @inject(ParticipateRequestRepository)
    private readonly _participateRequestRepository: ParticipateRequestRepository,
  ) {}

  async getMany(
    userId: number,
    options?: GetManyOptionsDTO<ParticipateRequestEntity>,
  ) {
    const findOptions = {
      ...options?.getFindOptions,
      where: {
        ...options?.getFindOptions?.where,
        userId,
      },
    };

    return this._participateRequestRepository.getMany(findOptions);
  }

  async getById(id: number) {
    const data = await this._participateRequestRepository.getById(id);

    if (!data) {
      throw new NotFoundError(`Participate request with id ${id} not found`);
    }

    return data;
  }

  async create(
    payload: TClientParticipateRequestCreatePayload & { userId: number },
  ) {
    const data = await this._participateRequestRepository.create(payload);

    if (!data) {
      throw new NotFoundError(`Participate request was not created`);
    }

    return data;
  }

  async update(id: number, payload: TClientParticipateRequestUpdatePayload) {
    const data = await this._participateRequestRepository.update(id, payload);

    if (!data) {
      throw new NotFoundError(`Participate request was not updated`);
    }

    return data;
  }

  delete(id: number) {
    return this._participateRequestRepository.delete(id);
  }
}
