import { inject, injectable } from "inversify";
import { AdminUserService } from "@way-to-bot/server/admin/services/user.service.mjs";
import {
  TAdminUserCreatePayload,
  TAdminUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/user.schema.js";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";
import {
  AdminDTOUserCreateResponse,
  AdminDTOUserDeleteResponse,
  AdminDTOUserGetMany,
  AdminDTOUserGetManyResponse,
  AdminDTOUserGetOne,
  AdminDTOUserGetOneResponse,
  AdminDTOUserUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/user.DTO.js";

@injectable()
export class AdminUserController {
  constructor(
    @inject(AdminUserService) private readonly _userService: AdminUserService,
  ) {}

  async getMany(options?: GetManyOptionsDTO<UserEntity>) {
    const data = await this._userService.getMany(options);
    return new AdminDTOUserGetManyResponse(
      data.data.map((i) => new AdminDTOUserGetMany(i)),
      {
        itemsPerPage: options?.getFindOptions?.take,
        pageNumber: options?.getFindOptions?.skip,
        totalRows: data.count,
      },
    );
  }

  async getOne(id: number) {
    const data = await this._userService.getOne(id);
    return new AdminDTOUserGetOneResponse(new AdminDTOUserGetOne(data));
  }

  async create(payload: TAdminUserCreatePayload) {
    const data = await this._userService.create(payload);
    return new AdminDTOUserCreateResponse(new AdminDTOUserGetOne(data));
  }

  async update(id: number, payload: TAdminUserUpdatePayload) {
    const data = await this._userService.update(id, payload);
    return new AdminDTOUserUpdateResponse(new AdminDTOUserGetOne(data));
  }

  async delete(id: number) {
    const data = await this._userService.delete(id);
    return new AdminDTOUserDeleteResponse(data);
  }
}
