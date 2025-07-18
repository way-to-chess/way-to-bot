import { inject, injectable } from "inversify";
import { ClientUserService } from "@way-to-bot/server/client/services/user.service";
import {
  ClientDTOUserGetMany,
  ClientDTOUserGetManyResponse,
  ClientDTOUserGetOne,
  ClientDTOUserGetOneResponse,
  ClientDTOUserCreateResponse,
  ClientDTOUserUpdateResponse,
} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import { Request, Response } from "express";

@injectable()
export class ClientUserController {
  constructor(
    @inject(ClientUserService)
    private readonly _userService: ClientUserService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options = req.getManyOptions;
    const result = await this._userService.getMany(options);
    const data = new ClientDTOUserGetManyResponse(
      result.data.map((i) => new ClientDTOUserGetMany(i)),
      {
        limit: options?.pagination?.limit,
        offset: options?.pagination?.offset,
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
