import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { FindManyOptions, FindOptionsWhere, QueryRunner } from "typeorm";
import {
  TAdminEventCreatePayload,
  TAdminEventUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/event.schema.js";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";

@injectable()
export class EventRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(EventEntity);
    }
    return this._dbService.dataSource.getRepository(EventEntity);
  }

  async getById(id: number, queryRunner?: QueryRunner) {
    const event = await this.getRepository(queryRunner).findOne({
      where: { id },
      relations: {
        location: true,
        preview: true,
        eventLeagues: {
          participants: {
            user: {
              photo: true,
            },
          },
        },
        host: true,
      },
    });

    if (!event) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }

    return event;
  }

  getBy(where: FindOptionsWhere<EventEntity>, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).findOneBy(where);
  }

  async getMany(
    options?: FindManyOptions<EventEntity>,
    queryRunner?: QueryRunner,
  ) {
    const query = this.getRepository(queryRunner)
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.preview", "preview")
      .leftJoinAndSelect("event.location", "location")
      .leftJoinAndSelect("event.host", "host")
      .leftJoin("event.eventLeagues", "el")
      .leftJoin("el.participants", "elu")
      .loadRelationCountAndMap(
        "event.participantsCount",
        "event.eventLeagues.eventLeagueUsers",
      );

    if (options?.take) {
      query.limit(options.take);
    }

    if (options?.skip) {
      query.skip(options.skip);
    }

    const [data, count] = (await query.getManyAndCount()) as unknown as [
      (EventEntity & { participantsCount: number })[],
      number,
    ];

    return {
      data,
      count,
    };
  }

  async create(event: TAdminEventCreatePayload, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const newEvent = repo.create(event);
    const savedEvent = await this.getRepository(queryRunner).save(newEvent);
    return this.getById(savedEvent.id, queryRunner);
  }

  async update(
    id: number,
    payload: TAdminEventUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingEvent = await this.getBy({ id }, queryRunner);

    if (!existingEvent) {
      throw new Error(`Event with id ${id} not found`);
    }

    const updatedEvent = repo.merge(existingEvent, payload);
    const savedEvent = await repo.save(updatedEvent);

    return this.getById(savedEvent.id, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingEvent = await this.getBy({ id }, queryRunner);

    if (!existingEvent) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
