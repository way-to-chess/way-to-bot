import { inject, injectable } from "inversify";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import {
  TClientUserCreatePayload,
  TClientUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/user.schema.js";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";

@injectable()
export class ClientUserService {
  constructor(
    @inject(UserRepository) private readonly _userRepository: UserRepository,
  ) {}

  async getMany(options?: TCommonGetManyOptions) {
    return this._userRepository.getMany(options);
  }

  async getById(id: number) {
    const data = await this._userRepository.getOne({ where: { id } });
    if (!data) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    return data;
  }

  async getByTgIdOrUsername(tgId: string, username: string) {
    const userByTgId =
      tgId &&
      (await this._userRepository.getOne({
        where: { tgId: String(tgId) },
      }));

    if (userByTgId) {
      return userByTgId;
    }

    const userByUsername =
      username &&
      (await this._userRepository.getOne({
        where: { username: `@${username}` },
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
    if (!data) throw new InternalError(`User was not created`);
    return data;
  }
}
