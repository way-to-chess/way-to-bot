import { inject, injectable } from "inversify";
import { DeepPartial, FindOneOptions, QueryRunner } from "typeorm";
import { DbService } from "@way-to-bot/server/services/db.service";
import { LocationEntity } from "@way-to-bot/server/database/entities/location.entity";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { TAdminLocationCreatePayload } from "@way-to-bot/shared/api/zod/admin/location.schema";
import { TAdminLeagueUpdatePayload } from "@way-to-bot/shared/api/zod/admin/league.schema";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO";

@injectable()
export class LocationRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(LocationEntity);
    }
    return this._dbService.dataSource.getRepository(LocationEntity);
  }

  async getMany(options?: TCommonGetManyOptions, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const queryBuilder = repo
      .createQueryBuilder("location")
      .leftJoinAndSelect("location.preview", "preview");

    if (options) {
      const manyOptionsDTO = new GetManyOptionsDTO<LocationEntity>(options);
      manyOptionsDTO.applyToQueryBuilder(queryBuilder, "location");
    }

    const [data, count] = await queryBuilder.getManyAndCount();

    return {
      data,
      count,
    };
  }

  getOne(options: FindOneOptions<LocationEntity>, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).findOne({
      relations: {
        preview: true,
      },
      ...options,
    });
  }

  async create(
    payload: TAdminLocationCreatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const newLocation = repo.create(payload);
    await repo.save(newLocation);
    return this.getOne({ where: { id: newLocation.id } }, queryRunner);
  }

  async update(
    id: number,
    payload: TAdminLeagueUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingLocation = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingLocation) {
      throw new NotFoundError(`Location with id ${id} not found`);
    }

    const updatedLocation = repo.merge(
      existingLocation,
      payload as DeepPartial<LocationEntity>,
    );

    await repo.save(updatedLocation);
    return this.getOne({ where: { id: updatedLocation.id } }, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingLocation = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingLocation) {
      throw new NotFoundError(`Location with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
