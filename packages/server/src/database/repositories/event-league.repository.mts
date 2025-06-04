import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { FindManyOptions, FindOneOptions, QueryRunner } from "typeorm";
import { EventLeagueEntity } from "@way-to-bot/server/database/entities/event-league.entity.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import {
  TAdminEventLeagueCreatePayload,
  TAdminEventLeagueUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/event-league.schema.js";
import { DEFAULT_LEAGUE_NAME } from "@way-to-bot/server/utils/constants.mjs";
import { LeagueRepository } from "@way-to-bot/server/database/repositories/league.repository.mjs";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";

@injectable()
export class EventLeagueRepository {
  constructor(
    @inject(DbService) private readonly _dbService: DbService,
    @inject(LeagueRepository)
    private readonly _leagueRepository: LeagueRepository,
  ) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(EventLeagueEntity);
    }
    return this._dbService.dataSource.getRepository(EventLeagueEntity);
  }

  getMany(
    options?: FindManyOptions<EventLeagueEntity>,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    return repo.find(options);
  }

  async getOne(
    options: FindOneOptions<EventLeagueEntity>,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    return repo.findOne({
      relations: {
        participants: true,
      },
      ...options,
    });
  }

  async create(
    payload: TAdminEventLeagueCreatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);

    if (!payload.leagueId) {
      const league = await this._leagueRepository.getOne({
        where: { name: DEFAULT_LEAGUE_NAME },
      });

      if (!league) {
        throw new InternalError("Default league was not found");
      }

      payload.leagueId = league.id;
    }

    const newEventLeague = repo.create(payload);
    const savedEventLeague = await repo.save(newEventLeague);
    return this.getOne({ where: { id: savedEventLeague.id } }, queryRunner);
  }

  async update(
    id: number,
    payload: TAdminEventLeagueUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingEventLeague = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingEventLeague) {
      throw new NotFoundError(`Event League with id ${id} not found`);
    }

    const updatedEventLeague = repo.merge(existingEventLeague, payload);
    const savedEventLeague = await repo.save(updatedEventLeague);

    return this.getOne({ where: { id: savedEventLeague.id } }, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingEventLeague = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingEventLeague) {
      throw new NotFoundError(`Event League with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }

  // TODO Do we need it ?
  // async getOneByEventIdAndLeagueId(
  //   eventId: number,
  //   leagueId?: number,
  //   queryRunner?: QueryRunner,
  // ) {
  //   const repo = this.getRepository(queryRunner);
  //
  //   const query = repo
  //     .createQueryBuilder("eventLeague")
  //     .leftJoinAndSelect("eventLeague.participants", "participants")
  //     .leftJoinAndSelect("eventLeague.league", "league")
  //     .where("eventLeague.eventId = :eventId", { eventId });
  //
  //   if (leagueId) {
  //     query.where("eventLeague.leagueId = :leagueId", { leagueId });
  //   } else {
  //     query.where("league.name = :leagueName", {
  //       leagueName: DEFAULT_LEAGUE_NAME,
  //     });
  //   }
  //
  //   return query.getOne();
  // }
}
