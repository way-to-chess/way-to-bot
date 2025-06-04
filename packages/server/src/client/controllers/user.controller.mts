import { inject, injectable } from "inversify";
import { ClientUserService } from "@way-to-bot/server/client/services/user.service.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";
import {
  ClientDTOUserCreateResponse,
  ClientDTOUserGetMany,
  ClientDTOUserGetManyResponse,
  ClientDTOUserGetOne,
  ClientDTOUserGetOneResponse,
  ClientDTOUserUpdateResponse,
} from "@way-to-bot/shared/api/DTO/client/user.DTO.js";
import { Response, Request } from "express";

@injectable()
export class ClientUserController {
  constructor(
    @inject(ClientUserService) private _userService: ClientUserService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options = req.getManyOptions as GetManyOptionsDTO<UserEntity>;
    const result = await this._userService.getMany(options);
    const data = new ClientDTOUserGetManyResponse(
      result.data.map((i) => new ClientDTOUserGetMany(i)),
      {
        limit: options?.getFindOptions?.take,
        offset: options?.getFindOptions?.skip,
        totalRows: result.count,
      },
    );
    res.status(200).send(data);
  }

  async getById(req: Request, res: Response) {
    const result = await this._userService.getById(+req.params.id!);
    const data = new ClientDTOUserGetOneResponse(
      new ClientDTOUserGetOne(result),
    );
    res.status(200).send(data);
  }

  async create(req: Request, res: Response) {
    const result = await this._userService.create(req.body);
    const data = new ClientDTOUserCreateResponse(
      new ClientDTOUserGetOne(result),
    );
    res.status(201).send(data);
  }

  async update(req: Request, res: Response) {
    const result = await this._userService.update(+req.params.id!, req.body);
    const data = new ClientDTOUserUpdateResponse(
      new ClientDTOUserGetOne(result),
    );
    res.status(200).send(data);
  }
}
