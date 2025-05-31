import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { FindOneOptions, FindOptionsWhere, QueryRunner } from "typeorm";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity.mjs";

@injectable()
export class EventLeagueUserRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(EventLeagueUserEntity);
    }
    return this._dbService.dataSource.getRepository(EventLeagueUserEntity);
  }

  getOne(
    options: FindOneOptions<EventLeagueUserEntity>,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    return repo.findOne(options);
  }

  addRows(eluList: EventLeagueUserEntity[], queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    return repo.save(eluList);
  }

  async deleteRows(
    whereOptions: FindOptionsWhere<EventLeagueUserEntity>,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const deletedRows = await repo.delete(whereOptions);
    return deletedRows.affected;
  }
}
