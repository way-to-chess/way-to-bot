import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { FindManyOptions, FindOneOptions, QueryRunner } from "typeorm";
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

  async getOne(
    options: FindOneOptions<EventEntity>,
    queryRunner?: QueryRunner,
  ) {
    return this.getRepository(queryRunner).findOne({
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
      ...options,
    });
  }

  async getMany(
    options?: FindManyOptions<EventEntity>,
    queryRunner?: QueryRunner,
  ) {
    const [data, count] = await this.getRepository(queryRunner).findAndCount({
      relations: {
        location: true,
        preview: true,
        eventLeagues: {
          participants: {
            user: true,
          },
        },
        host: true,
      },
      ...options,
    });

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
