import { inject, injectable } from "inversify";
import { ClientUserService } from "@way-to-bot/server/client/services/user.service.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";
import {
  TClientUserCreatePayload,
  TClientUserUpdatePayload,
} from "@way-to-bot/shared/api/zod/client/user.schema.js";
import {
  ClientDTOUserCreateResponse,
  ClientDTOUserGetMany,
  ClientDTOUserGetManyResponse,
  ClientDTOUserGetOne,
  ClientDTOUserGetOneResponse,
  ClientDTOUserUpdateResponse,
} from "@way-to-bot/shared/api/DTO/client/user.DTO.js";

@injectable()
export class ClientUserController {
  constructor(
    @inject(ClientUserService) private _userService: ClientUserService,
  ) {}

  async getMany(options?: GetManyOptionsDTO<UserEntity>) {
    const data = await this._userService.getMany(options);
    return new ClientDTOUserGetManyResponse(
      data.data.map((i) => new ClientDTOUserGetMany(i)),
      {
        itemsPerPage: options?.getFindOptions?.take,
        pageNumber: options?.getFindOptions?.skip,
        totalRows: data.count,
      },
    );
  }

  async getById(id: number) {
    const data = await this._userService.getById(id);
    return new ClientDTOUserGetOneResponse(new ClientDTOUserGetOne(data));
  }

  async create(payload: TClientUserCreatePayload) {
    const data = await this._userService.create(payload);
    return new ClientDTOUserCreateResponse(new ClientDTOUserGetOne(data));
  }

  async update(id: number, payload: TClientUserUpdatePayload) {
    const data = await this._userService.update(id, payload);
    return new ClientDTOUserUpdateResponse(new ClientDTOUserGetOne(data));
  }
}
