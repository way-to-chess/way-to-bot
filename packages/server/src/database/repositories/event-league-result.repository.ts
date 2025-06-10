import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { FindOneOptions, QueryRunner } from "typeorm";
import { EventLeagueResultEntity } from "@way-to-bot/server/database/entities/event-league-result.entity.mjs";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";

@injectable()
export class EventLeagueResultRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(EventLeagueResultEntity);
    }
    return this._dbService.dataSource.getRepository(EventLeagueResultEntity);
  }

  async getOne(
    options: FindOneOptions<EventLeagueResultEntity>,
    queryRunner?: QueryRunner,
  ) {
    return this.getRepository(queryRunner).findOne(options);
  }

  async getMany(options?: TCommonGetManyOptions, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const queryBuilder = repo
      .createQueryBuilder("eventLeagueResult")
      .leftJoinAndSelect("eventLeagueResult.roundsFile", "roundsFile")
      .leftJoinAndSelect("eventLeagueResult.ratingFile", "ratingFile");

    if (options) {
      const manyOptionsDTO = new GetManyOptionsDTO<EventLeagueResultEntity>(
        options,
      );
      manyOptionsDTO.applyToQueryBuilder(queryBuilder, "eventLeagueResult");
    }

    const [data, count] = await queryBuilder.getManyAndCount();

    return {
      data,
      count,
    };
  }

  async upsert(
    payload: {
      eventLeagueId: number;
      roundsFileId?: number;
      ratingFileId?: number;
    },
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);

    await repo.upsert(payload, {
      conflictPaths: { eventLeagueId: true },
    });

    return this.getOne({ where: { eventLeagueId: payload.eventLeagueId } });
  }
}
