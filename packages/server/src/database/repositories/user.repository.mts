import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { FindManyOptions, FindOptionsWhere, QueryRunner } from "typeorm";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import {
  TAdminUserCreatePayload,
  TAdminUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/user.schema.js";
import {
  TClientUserCreatePayload,
  TClientUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/user.schema.js";

@injectable()
export class UserRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(UserEntity);
    }
    return this._dbService.dataSource.getRepository(UserEntity);
  }

  async getById(id: number, queryRunner?: QueryRunner) {
    const user = await this.getRepository(queryRunner).findOne({
      where: {
        id: id,
      },
      relations: {
        eventLeagues: {
          eventLeague: {
            event: {
              location: true,
              preview: true,
            },
          },
        },
        photo: true,
        participateRequests: { event: true },
      },
    });

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return user;
  }

  getBy(where: FindOptionsWhere<UserEntity>, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).findOneBy(where);
  }

  async getMany(
    options?: FindManyOptions<UserEntity>,
    queryRunner?: QueryRunner,
  ) {
    const [data, count] = await this.getRepository(queryRunner).findAndCount({
      relations: {
        photo: true,
      },
      ...options,
    });
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
    const newUser = repo.create(payload);
    const savedUser = await repo.save(newUser);
    return this.getById(savedUser.id, queryRunner);
  }

  async update(
    id: number,
    payload: TAdminUserUpdatePayload | TClientUserUpdatePayload,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const existingUser = await this.getBy({ id }, queryRunner);

    if (!existingUser) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const updatedUser = repo.merge(existingUser, payload);

    const savedUser = await repo.save(updatedUser);
    return this.getById(savedUser.id, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingUser = await this.getBy({ id }, queryRunner);

    if (!existingUser) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
