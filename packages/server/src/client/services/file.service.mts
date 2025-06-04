import { inject, injectable } from "inversify";
import { FileRepository } from "@way-to-bot/server/database/repositories/file.repository.mjs";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";
import fsAsync from "fs/promises";
import { logger } from "@way-to-bot/server/services/logger.service.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import path from "path";
import { PATH_TO_UPLOADS } from "@way-to-bot/server/utils/constants.mjs";

@injectable()
export class ClientFileService {
  constructor(
    @inject(FileRepository) private readonly _fileRepository: FileRepository,
  ) {}

  async create(file: Express.Multer.File) {
    const data = await this._fileRepository.create({
      url: file.path,
      // @ts-expect-error Ignat
      previewUrl: file.previewFilePath,
    });

    if (!data) {
      throw new InternalError("File was not created");
    }

    return data;
  }

  async delete(id: number) {
    const file = await this._fileRepository.getOne({ where: { id } });

    if (!file) {
      throw new NotFoundError(`File with id ${id} not found`);
    }

    const data = await this._fileRepository.delete(id);

    if (data) {
      try {
        const fullFileUrl = path.join(
          file.url.replace("uploads", PATH_TO_UPLOADS),
        );
        await fsAsync.rm(path.dirname(fullFileUrl), {
          recursive: true,
          force: true,
        });
      } catch (e) {
        logger.error(`File was not deleted: ${e}`);
      }
    }

    return data;
  }
}
