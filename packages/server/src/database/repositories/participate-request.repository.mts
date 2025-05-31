import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { FindManyOptions, QueryRunner } from "typeorm";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";
import {
  TClientParticipateRequestCreatePayload,
  TClientParticipateRequestUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/participate-request.schema.js";
import { TAdminParticipateRequestUpdatePayload } from "@way-to-bot/shared/api/zod/admin/participate-request.schema.js";

@injectable()
export class ParticipateRequestRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(ParticipateRequestEntity);
    }
    return this._dbService.dataSource.getRepository(ParticipateRequestEntity);
  }

  getById(id: number, queryRunner?: QueryRunner, relations = true) {
    return this.getRepository(queryRunner).findOne({
      where: { id },
      ...(relations && {
        relations: {
          receipt: true,
          user: { photo: true },
          event: true,
        },
      }),
    });
  }

  async getMany(
    options?: FindManyOptions<ParticipateRequestEntity>,
    queryRunner?: QueryRunner,
  ) {
    const [data, count] = await this.getRepository(queryRunner).findAndCount({
      relations: {
        receipt: true,
        user: { photo: true },
        event: true,
      },
      ...options,
    });
    return { data, count };
  }

  async create(
    payload: TClientParticipateRequestCreatePayload & { userId: number },
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const newParticipateRequest = repo.create(payload);
    const savedParticipateRequest = await repo.save(newParticipateRequest);
    return this.getById(savedParticipateRequest.id, queryRunner);
  }

  async update(
    id: number,
    payload:
      | TClientParticipateRequestUpdatePayload
      | TAdminParticipateRequestUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingParticipateRequest = await this.getById(
      id,
      queryRunner,
      false,
    );

    if (!existingParticipateRequest) {
      throw new NotFoundError(`Participate request with id ${id} not found`);
    }

    const updatedParticipateRequest = repo.merge(
      existingParticipateRequest,
      payload,
    );

    const savedParticipateRequest = await repo.save(updatedParticipateRequest);
    return this.getById(savedParticipateRequest.id, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingParticipateRequest = await this.getById(
      id,
      queryRunner,
      false,
    );

    if (!existingParticipateRequest) {
      throw new NotFoundError(`Participate request with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
