import { inject, injectable } from "inversify";
import { ParticipateRequestRepository } from "@way-to-bot/server/database/repositories/participate-request.repository.mjs";
import {
  TClientParticipateRequestCreatePayload,
  TClientParticipateRequestUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/participate-request.schema.js";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { EOperandPredicate, EPredicate } from "@way-to-bot/shared/api/enums";

@injectable()
export class ClientParticipateRequestService {
  constructor(
    @inject(ParticipateRequestRepository)
    private readonly _participateRequestRepository: ParticipateRequestRepository,
  ) {}

  async getMany(userId: number, options?: TCommonGetManyOptions) {
    if (!options) {
      options = {};
    }
    const savedOptionsWhere = options.where ? options.where : null;
    options.where = {
      predicate: EPredicate.AND,
      operands: [
        { field: "userId", predicate: EOperandPredicate.EQ, value: userId },
      ],
    };

    if (savedOptionsWhere) options.where.operands.push(savedOptionsWhere);

    return this._participateRequestRepository.getMany(options);
  }

  async getById(id: number) {
    const data = await this._participateRequestRepository.getOne({
      where: { id },
    });

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
