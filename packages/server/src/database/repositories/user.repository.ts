import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service";
import { FindOneOptions, FindOptionsWhere, QueryRunner, ReturnDocument } from "typeorm";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import {
  TAdminUserCreatePayload,
  TAdminUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/user.schema";
import {
  TClientUserCreatePayload,
  TClientUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/user.schema";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error";

@injectable()
export class UserRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(UserEntity);
    }
    return this._dbService.dataSource.getRepository(UserEntity);
  }

  async getOne(options: FindOneOptions<UserEntity>, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).findOne({
      relations: {
        eventLeagues: {
          eventLeague: {
            league: true,
            event: {
              location: true,
              preview: true,
            },
          },
        },
        photo: true,
        participateRequests: { event: true },
      },
      ...options,
    });
  }

  async getMany(options?: TCommonGetManyOptions, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const queryBuilder = repo.createQueryBuilder("user");

    queryBuilder.leftJoinAndSelect("user.photo", "photo");

    if (options) {
      const manyOptionsDTO = new GetManyOptionsDTO<UserEntity>(options);
      manyOptionsDTO.applyToQueryBuilder(queryBuilder, "user");
    }

    const [data, count] = await queryBuilder.getManyAndCount();

    return {
      data,
      count,
    };
  }

  async create(
    payload: TAdminUserCreatePayload | TClientUserCreatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    if (payload.tgId) {
      await repo.upsert(payload, ["tgId"]);
      return this.getOne({ where: { tgId: payload.tgId } }, queryRunner);
    } else {
      const newUser = repo.create(payload);
      const savedUser = await repo.save(newUser);
      return this.getOne({ where: { id: savedUser.id } }, queryRunner);
    }
  }

  async findOrCreateByIdOrEmail(
    payload: TClientUserCreatePayload & { id?: number },
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const orConditions: FindOptionsWhere<UserEntity>[] = [{ id: payload.id }];
    if (payload.email) {
      orConditions.push({ email: payload.email });
    }
    const existingUser = await repo.findOneBy(orConditions);

    if (existingUser) {
      return existingUser.id;
    }

    const newUser = repo.create(payload);
    const savedUser = await repo.save(newUser);
    return savedUser.id;
  }

  async update(
    id: number,
    payload: TAdminUserUpdatePayload | TClientUserUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingUser = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingUser) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const updatedUser = repo.merge(existingUser, payload);

    const savedUser = await repo.save(updatedUser);
    return this.getOne({ where: { id: savedUser.id } }, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingUser = await this.getOne(
      { where: { id }, relations: undefined },
      queryRunner,
    );

    if (!existingUser) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
