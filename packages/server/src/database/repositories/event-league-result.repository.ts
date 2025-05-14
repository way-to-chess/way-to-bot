import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { QueryRunner } from "typeorm";
import { EventLeagueResultEntity } from "@way-to-bot/server/database/entities/event-league-result.entity.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";

@injectable()
export class EventLeagueResultRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(EventLeagueResultEntity);
    }
    return this._dbService.dataSource.getRepository(EventLeagueResultEntity);
  }

  async getOneByEventLeagueId(
    eventLeagueId: number,
    queryRunner?: QueryRunner,
  ) {
    return this.getRepository(queryRunner).findOne({
      where: { eventLeagueId },
    });
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

    return this.getOneByEventLeagueId(payload.eventLeagueId);
  }
}
