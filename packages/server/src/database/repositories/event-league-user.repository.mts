import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { FindOneOptions, FindOptionsWhere, QueryRunner } from "typeorm";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity.mjs";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";

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

  async getMany(options?: TCommonGetManyOptions, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const queryBuilder = repo
      .createQueryBuilder("eventLeagueUser")
      .leftJoinAndSelect("eventLeagueUser.user", "user")
      .leftJoinAndSelect("eventLeagueUser.eventLeague", "eventLeague");

    if (options) {
      const manyOptionsDTO = new GetManyOptionsDTO<EventLeagueUserEntity>(
        options,
      );
      manyOptionsDTO.applyToQueryBuilder(queryBuilder, "eventLeagueUser");
    }

    const [data, count] = await queryBuilder.getManyAndCount();

    return {
      data,
      count,
    };
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
