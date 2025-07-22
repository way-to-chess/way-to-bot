import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { ClientFileService } from "@way-to-bot/server/client/services/file.service";
import {
  ClientDTOFileCreateResponse,
  ClientDTOFileDeleteResponse,
  ClientDTOFileGetOne,
} from "@way-to-bot/shared/api/DTO/client/file.DTO";

@injectable()
export class ClientFileController {
  constructor(
    @inject(ClientFileService)
    private readonly _clientFileService: ClientFileService,
  ) {}

  async create(req: Request, res: Response) {
    const result = await this._clientFileService.create(req.file!);
    const data = new ClientDTOFileCreateResponse(
      new ClientDTOFileGetOne(result),
    );
    res.status(201).send(data);
  }

  async delete(req: Request, res: Response) {
    const result = await this._clientFileService.delete(+req.params.id!);
    const data = new ClientDTOFileDeleteResponse(result);
    res.status(200).send(data);
  }
}
