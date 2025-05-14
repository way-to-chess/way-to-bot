import { inject, injectable } from "inversify";
import { ClientFileService } from "@way-to-bot/server/client/services/file.service.mjs";
import { EFileAssigment } from "@way-to-bot/shared/api/enums";
import {
  ClientDTOFileCreateResponse,
  ClientDTOFileDeleteResponse,
  ClientDTOFileGetOne,
} from "@way-to-bot/shared/api/DTO/client/file.DTO.js";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error.mjs";

@injectable()
export class ClientFileController {
  constructor(
    @inject(ClientFileService)
    private readonly _clientFileService: ClientFileService,
  ) {}

  async create(file?: Express.Multer.File, assigment?: EFileAssigment) {
    if (!file) {
      throw new BadRequestError("No file found in request");
    }

    const data = await this._clientFileService.create(file);
    return new ClientDTOFileCreateResponse(new ClientDTOFileGetOne(data));
  }

  async delete(id: number) {
    const data = await this._clientFileService.delete(id);
    return new ClientDTOFileDeleteResponse(data);
  }
}
