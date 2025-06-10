import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { FindOneOptions, QueryRunner } from "typeorm";
import { LeagueEntity } from "@way-to-bot/server/database/entities/league.entity.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import {
  TAdminLeagueCreatePayload,
  TAdminLeagueUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/league.schema.js";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";

@injectable()
export class LeagueRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(LeagueEntity);
    }
    return this._dbService.dataSource.getRepository(LeagueEntity);
  }

  getOne(options: FindOneOptions<LeagueEntity>, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).findOne(options);
  }

  async getMany(options?: TCommonGetManyOptions, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const queryBuilder = repo.createQueryBuilder("league");

    if (options) {
      const manyOptionsDTO = new GetManyOptionsDTO<LeagueEntity>(options);
      manyOptionsDTO.applyToQueryBuilder(queryBuilder, "league");
    }

    const [data, count] = await queryBuilder.getManyAndCount();

    return {
      data,
      count,
    };
  }

  async create(payload: TAdminLeagueCreatePayload, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const newLeague = repo.create(payload);
    const savedLeague = await repo.save(newLeague);
    return this.getOne({ where: { id: savedLeague.id } }, queryRunner);
  }

  async update(
    id: number,
    payload: TAdminLeagueUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingLeague = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingLeague) {
      throw new NotFoundError(`League with id ${id} not found`);
    }

    const updatedLeague = repo.merge(existingLeague, payload);

    const savedLeague = await repo.save(updatedLeague);
    return this.getOne({ where: { id: savedLeague.id } }, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingLeague = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingLeague) {
      throw new NotFoundError(`League with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
