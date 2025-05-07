import { inject, injectable } from "inversify";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import {
  TAdminUserCreatePayload,
  TAdminUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/user.schema.js";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";

@injectable()
export class AdminUserService {
  constructor(
    @inject(UserRepository) private readonly _userRepository: UserRepository,
  ) {}

  async getMany(options?: GetManyOptionsDTO<UserEntity>) {
    return this._userRepository.getMany(options?.getFindOptions);
  }

  async getOne(id: number) {
    return this._userRepository.getById(id);
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
