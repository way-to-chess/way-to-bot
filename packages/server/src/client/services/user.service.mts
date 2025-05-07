import { inject, injectable } from "inversify";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import {
  TClientUserCreatePayload,
  TClientUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/user.schema.js";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";

@injectable()
export class ClientUserService {
  constructor(
    @inject(UserRepository) private readonly _userRepository: UserRepository,
  ) {}

  async getMany(options?: GetManyOptionsDTO<UserEntity>) {
    return this._userRepository.getMany(options?.getFindOptions);
  }

  getById(id: number) {
    return this._userRepository.getById(id);
  }

  async getByTgIdOrUsername(tgId: string, username: string) {
    const user = await this._userRepository.getBy({
      ...(tgId && { tgId: String(tgId) }),
      ...(username && { username: `@${username}` }),
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

  create(payload: TClientUserCreatePayload) {
    return this._userRepository.create(payload);
  }

  update(id: number, payload: TClientUserUpdatePayload) {
    return this._userRepository.update(id, payload);
  }
}
