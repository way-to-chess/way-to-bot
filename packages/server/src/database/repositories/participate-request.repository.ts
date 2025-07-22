import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service";
import { FindOneOptions, QueryRunner } from "typeorm";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity";
import { TClientParticipateRequestCreatePayload } from "@way-to-bot/shared/api/zod/client/participate-request.schema";
import { TAdminParticipateRequestUpdatePayload } from "@way-to-bot/shared/api/zod/admin/participate-request.schema";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO";

@injectable()
export class ParticipateRequestRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(ParticipateRequestEntity);
    }
    return this._dbService.dataSource.getRepository(ParticipateRequestEntity);
  }

  getOne(
    options: FindOneOptions<ParticipateRequestEntity>,
    queryRunner?: QueryRunner,
  ) {
    return this.getRepository(queryRunner).findOne({
      relations: {
        receipt: true,
        user: { photo: true },
        event: { location: true },
      },
      ...options,
    });
  }

  async getMany(options?: TCommonGetManyOptions, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const queryBuilder = repo
      .createQueryBuilder("participateRequest")
      .leftJoinAndSelect("participateRequest.receipt", "receipt")
      .leftJoinAndSelect("participateRequest.user", "user")
      .leftJoinAndSelect("user.photo", "userPhoto")
      .leftJoinAndSelect("participateRequest.event", "event");

    if (options) {
      const manyOptionsDTO = new GetManyOptionsDTO<ParticipateRequestEntity>(
        options,
      );
      manyOptionsDTO.applyToQueryBuilder(queryBuilder, "participateRequest");
    }

    const [data, count] = await queryBuilder.getManyAndCount();

    return {
      data,
      count,
    };
  }

  async create(
    payload: TClientParticipateRequestCreatePayload & { userId: number },
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const newParticipateRequest = repo.create(payload);
    const savedParticipateRequest = await repo.save(newParticipateRequest);
    return this.getOne(
      { where: { id: savedParticipateRequest.id } },
      queryRunner,
    );
  }

  async update(
    id: number,
    payload: TAdminParticipateRequestUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingParticipateRequest = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingParticipateRequest) {
      throw new NotFoundError(`Participate request with id ${id} not found`);
    }

    const updatedParticipateRequest = repo.merge(
      existingParticipateRequest,
      payload,
    );

    const savedParticipateRequest = await repo.save(updatedParticipateRequest);
    return this.getOne(
      { where: { id: savedParticipateRequest.id } },
      queryRunner,
    );
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingParticipateRequest = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingParticipateRequest) {
      throw new NotFoundError(`Participate request with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
