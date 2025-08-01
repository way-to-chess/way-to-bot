import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity";
import { FindOneOptions, QueryRunner } from "typeorm";
import {
  TAdminEventCreatePayload,
  TAdminEventUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/event.schema";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO";

@injectable()
export class EventRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(EventEntity);
    }
    return this._dbService.dataSource.getRepository(EventEntity);
  }

  async getOne(
    options: FindOneOptions<EventEntity>,
    queryRunner?: QueryRunner,
  ) {
    return this.getRepository(queryRunner).findOne({
      relations: {
        location: {
          preview: true,
        },
        preview: true,
        eventLeagues: {
          league: true,
          participants: {
            user: {
              photo: true,
            },
          },
        },
        host: {
          photo: true,
        },
      },
      ...options,
    });
  }

  async getMany(options?: TCommonGetManyOptions, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const queryBuilder = repo
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.location", "location")
      .leftJoinAndSelect("event.preview", "preview")
      .leftJoinAndSelect("event.eventLeagues", "eventLeagues")
      .leftJoinAndSelect("eventLeagues.league", "league")
      .leftJoinAndSelect("eventLeagues.participants", "participants")
      .leftJoinAndSelect("participants.user", "user")
      .leftJoinAndSelect("event.host", "host")
      .leftJoinAndSelect("host.photo", "hostPhoto")
      .addSelect(`
        CASE 
          WHEN event.status = 'started' THEN 1
          WHEN event.status = 'waiting' THEN 2
          WHEN event.status = 'finished' THEN 3
          ELSE 4
        END`, "sort_order")
      .addSelect(`
        CASE 
          WHEN event.status = 'finished' THEN event.date_time
          ELSE NULL
        END`, "finished_date")
      .addSelect(`
        CASE 
          WHEN event.status = 'finished' THEN NULL
          ELSE event.date_time
        END`, "active_date")
    if (options) {
      const manyOptionsDTO = new GetManyOptionsDTO<EventEntity>(options);
      manyOptionsDTO.applyToQueryBuilder(queryBuilder, "event");
    }

    if (!options?.sort) {
      queryBuilder.orderBy("sort_order", "ASC")
        .addOrderBy("finished_date", "DESC")
        .addOrderBy("active_date", "ASC");
    }

    const [data, count] = await queryBuilder.getManyAndCount();

    return {
      data,
      count,
    };
  }

  async create(event: TAdminEventCreatePayload, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const newEvent = repo.create(event);
    const savedEvent = await this.getRepository(queryRunner).save(newEvent);
    return this.getOne({ where: { id: savedEvent.id } }, queryRunner);
  }

  async update(
    id: number,
    payload: TAdminEventUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingEvent = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingEvent) {
      throw new Error(`Event with id ${id} not found`);
    }

    const updatedEvent = repo.merge(existingEvent, payload);
    const savedEvent = await repo.save(updatedEvent);

    return this.getOne({ where: { id: savedEvent.id } }, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingEvent = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingEvent) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
