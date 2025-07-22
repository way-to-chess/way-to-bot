import { inject, injectable } from "inversify";
import { AdminUserService } from "@way-to-bot/server/admin/services/user.service";
import {
  AdminDTOUserCreateResponse,
  AdminDTOUserDeleteResponse,
  AdminDTOUserGetMany,
  AdminDTOUserGetManyResponse,
  AdminDTOUserGetOne,
  AdminDTOUserGetOneResponse,
  AdminDTOUserUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/user.DTO";
import { Request, Response } from "express";

@injectable()
export class AdminUserController {
  constructor(
    @inject(AdminUserService) private readonly _userService: AdminUserService,
  ) {}

  async getMany(req: Request, res: Response) {
    const options = req.getManyOptions;
    const result = await this._userService.getMany(options);
    const data = new AdminDTOUserGetManyResponse(
      result.data.map((i) => new AdminDTOUserGetMany(i)),
      {
        limit: options?.pagination?.limit,
        offset: options?.pagination?.offset,
        totalRows: result.count,
      },
    );
    res.status(200).send(data);
  }

  async getOne(req: Request, res: Response) {
    const result = await this._userService.getOne(+req.params.id!);
    const data = new AdminDTOUserGetOneResponse(new AdminDTOUserGetOne(result));
    res.status(200).send(data);
  }

  async create(req: Request, res: Response) {
    const result = await this._userService.create(req.body);
    const data = new AdminDTOUserCreateResponse(new AdminDTOUserGetOne(result));
    res.status(201).send(data);
  }

  async update(req: Request, res: Response) {
    const result = await this._userService.update(+req.params.id!, req.body);
    const data = new AdminDTOUserUpdateResponse(new AdminDTOUserGetOne(result));
    res.status(200).send(data);
  }

  async delete(req: Request, res: Response) {
    const result = await this._userService.delete(+req.params.id!);
    const data = new AdminDTOUserDeleteResponse(result);
    res.status(200).send(data);
  }
}
