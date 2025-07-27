import { inject, injectable } from "inversify";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository";
import {
  TClientUserCreatePayload,
  TClientUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/user.schema";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { FindOptionsWhere, IsNull, Not } from "typeorm";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity";
import { EOperandPredicate } from "@way-to-bot/shared/api/enums/EOperandPredicate";
import { EPredicate } from "@way-to-bot/shared/api/enums/EPredicate";

@injectable()
export class ClientUserService {
  constructor(
    @inject(UserRepository) private readonly _userRepository: UserRepository,
  ) {}

  async getMany(options?: TCommonGetManyOptions) {
    const notNullOperands = [
      { field: "firstName", predicate: EOperandPredicate.NOT_EQ, value: null },
      { field: "lastName", predicate: EOperandPredicate.NOT_EQ, value: null },
    ];
    const finalOptions = !options?.where
      ? {
          ...options,
          where: {
            predicate: EPredicate.AND,
            operands: notNullOperands,
          },
        }
      : {
          ...options,
          where: {
            predicate: EPredicate.AND,
            operands: [options.where, ...notNullOperands],
          },
        };
    return this._userRepository.getMany(finalOptions);
  }

  async getById(id: number) {
    const data = await this._userRepository.getOne({ where: { id } });
    if (!data) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    return data;
  }

  async getByTgIdOrUsername(tgId: string, username: string) {
    const whereConditions: FindOptionsWhere<UserEntity> = {
      firstName: Not(IsNull()),
      lastName: Not(IsNull()),
    };

    const userByTgId =
      tgId &&
      (await this._userRepository.getOne({
        where: { ...whereConditions, tgId: String(tgId) },
      }));

    if (userByTgId) {
      if (username && userByTgId.username !== `@${username}`) {
        userByTgId.username = `@${username}`;
        await this._userRepository.update(userByTgId.id, {
          username: `@${username}`,
        });
      }
      return userByTgId;
    }

    const userByUsername =
      username &&
      (await this._userRepository.getOne({
        where: { ...whereConditions, username: `@${username}` },
      }));

    if (!userByUsername) {
      throw new NotFoundError(
        `User with tgId: ${tgId} and username: ${username} not found`,
      );
    }

    if (tgId && !userByUsername.tgId) {
      userByUsername.tgId = String(tgId);
      await this._userRepository.update(userByUsername.id, {
        tgId: String(tgId),
      });
    }

    return userByUsername;
  }

  async create(payload: TClientUserCreatePayload) {
    const data = await this._userRepository.create(payload);
    if (!data) throw new InternalError(`User was not created`);
    return data;
  }

  async update(id: number, payload: TClientUserUpdatePayload) {
    const data = await this._userRepository.update(id, payload);
    if (!data) throw new InternalError(`User was not updated`);
    return data;
  }
}
