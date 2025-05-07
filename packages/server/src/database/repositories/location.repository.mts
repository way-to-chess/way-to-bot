import { inject, injectable } from "inversify";
import { DeepPartial, FindManyOptions, QueryRunner } from "typeorm";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { LocationEntity } from "@way-to-bot/server/database/entities/location.entity.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import { TAdminLocationCreatePayload } from "@way-to-bot/shared/api/zod/admin/location.schema.js";
import { TAdminLeagueUpdatePayload } from "@way-to-bot/shared/api/zod/admin/league.schema.js";

@injectable()
export class LocationRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(LocationEntity);
    }
    return this._dbService.dataSource.getRepository(LocationEntity);
  }

  async getMany(
    options?: FindManyOptions<LocationEntity>,
    queryRunner?: QueryRunner,
  ) {
    const [data, count] =
      await this.getRepository(queryRunner).findAndCount(options);
    return {
      data,
      count,
    };
  }

  getById(id: number, queryRunner?: QueryRunner, relations = true) {
    return this.getRepository(queryRunner).findOne({
      where: { id },
      ...(relations && {
        relations: {
          preview: true,
        },
      }),
    });
  }

  getAll(queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).find({
      relations: {
        preview: true,
      },
    });
  }

  async create(
    payload: TAdminLocationCreatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const newLocation = repo.create(payload);
    await repo.save(newLocation);
    return this.getById(newLocation.id, queryRunner);
  }

  async update(
    id: number,
    payload: TAdminLeagueUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingLocation = await this.getById(id, queryRunner, false);

    if (!existingLocation) {
      throw new NotFoundError(`Location with id ${id} not found`);
    }

    const updatedLocation = repo.merge(
      existingLocation,
      payload as DeepPartial<LocationEntity>,
    );

    await repo.save(updatedLocation);
    return this.getById(updatedLocation.id, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingLocation = await this.getById(id, queryRunner, false);

    if (!existingLocation) {
      throw new NotFoundError(`Location with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
