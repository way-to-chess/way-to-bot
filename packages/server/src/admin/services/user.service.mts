import { inject, injectable } from "inversify";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import {
  TAdminUserCreatePayload,
  TAdminUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/user.schema.js";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";

@injectable()
export class AdminUserService {
  constructor(
    @inject(UserRepository) private readonly _userRepository: UserRepository,
  ) {}

  async getMany(options?: TCommonGetManyOptions) {
    return this._userRepository.getMany(options);
  }

  async getOne(id: number) {
    const data = await this._userRepository.getOne({ where: { id } });
    if (!data) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    return data;
  }

  async create(payload: TAdminUserCreatePayload) {
    const createdUser = await this._userRepository.create(payload);

    if (!createdUser) {
      throw new InternalError("User was not created");
    }

    return createdUser;
  }

  async update(id: number, payload: TAdminUserUpdatePayload) {
    const updatedUser = await this._userRepository.update(id, payload);

    if (!updatedUser) {
      throw new InternalError("User was not updated");
    }

    return updatedUser;
  }

  async delete(id: number) {
    return this._userRepository.delete(id);
  }
}
