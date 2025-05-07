import { inject, injectable } from "inversify";
import { FileRepository } from '@way-to-bot/server/database/repositories/file.repository.mjs';
import {EClientFileAssigment} from "@way-to-bot/shared/api/enums/index.js";

@injectable()
export class ClientFileService {
  constructor(
    @inject(FileRepository) private readonly _fileRepository: FileRepository,
  ) {}

  async add(file: Express.Multer.File, assigment: EClientFileAssigment) {

  }
}
