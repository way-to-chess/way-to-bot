import { inject, injectable } from "inversify";
import { ClientFileService } from '@way-to-bot/server/client/services/file.service.mjs';
import { EClientFileAssigment } from "@way-to-bot/shared/api/enums/index.js";

@injectable()
export class ClientFileController {
  constructor(
    @inject(ClientFileService)
    private readonly _clientFileService: ClientFileService,
  ) {}

  async add(file: Express.Multer.File, assigment: EClientFileAssigment) {

  }
}
