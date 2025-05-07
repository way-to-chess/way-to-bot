import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
} from "typeorm";
import { LeagueEntity } from "@way-to-bot/server/database/entities/league.entity.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import {
  TAdminLeagueCreatePayload,
  TAdminLeagueUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/league.schema.js";

@injectable()
export class LeagueRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(LeagueEntity);
    }
    return this._dbService.dataSource.getRepository(LeagueEntity);
  }

  getById(id: number, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).findOne({ where: { id } });
  }

  getOne(options: FindOneOptions<LeagueEntity>, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).findOne(options);
  }

  async getMany(
    options?: FindManyOptions<LeagueEntity>,
    queryRunner?: QueryRunner,
  ) {
    const [data, count] =
      await this.getRepository(queryRunner).findAndCount(options);
    return {
      data,
      count,
    };
  }

  async create(payload: TAdminLeagueCreatePayload, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const newLeague = repo.create(payload);
    const saveLeague = await repo.save(newLeague);
    return this.getById(saveLeague.id, queryRunner);
  }

  async update(
    id: number,
    payload: TAdminLeagueUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingLeague = await this.getById(id, queryRunner);

    if (!existingLeague) {
      throw new NotFoundError(`League with id ${id} not found`);
    }

    const updatedLeague = repo.merge(existingLeague, payload);

    const savedLeague = await repo.save(updatedLeague);
    return this.getById(savedLeague.id, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingLeague = await this.getById(id, queryRunner);

    if (!existingLeague) {
      throw new NotFoundError(`League with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
