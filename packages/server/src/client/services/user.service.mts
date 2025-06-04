import { inject, injectable } from "inversify";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import {
  TClientUserCreatePayload,
  TClientUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/user.schema.js";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";

@injectable()
export class ClientUserService {
  constructor(
    @inject(UserRepository) private readonly _userRepository: UserRepository,
  ) {}

  async getMany(options?: GetManyOptionsDTO<UserEntity>) {
    return this._userRepository.getMany(options?.getFindOptions);
  }

  async getById(id: number) {
    const data = await this._userRepository.getOne({ where: { id } });
    if (!data) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    return data;
  }

  async getByTgIdOrUsername(tgId: string, username: string) {
    const user = await this._userRepository.getOne({
      where: {
        ...(tgId && { tgId: String(tgId) }),
        ...(username && { username: `@${username}` }),
      },
    });

    if (!user) {
      throw new NotFoundError(
        `User with tgId: ${tgId} and username: ${username} not found`,
      );
    }

    if (tgId && !user.tgId) {
      user.tgId = String(tgId);
      await this._userRepository.update(user.id, { tgId: String(tgId) });
    }

    return user;
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
