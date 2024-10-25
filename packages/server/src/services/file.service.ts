import { dbInstance } from "packages/server/src/database/init";
import { File } from "../database/entities/file.entity";
import * as path from "path";
import { IFileDeletePayload } from "packages/shared/src/interfaces/file.interface";
import { rm } from "fs/promises";

export class FileService {
  private fileRepository = dbInstance.getRepository(File);

  async addFile(file: Express.Multer.File) {
    if (!file.destination || !file.filename) {
      throw new Error("No destination or filename, data corrupted");
    }

    const newFile = new File();
    newFile.url = path.join(file.destination, file.filename);

    const savedFile = await this.fileRepository.save(newFile);
    if (!savedFile) {
      throw new Error("File was not saved, please try again");
    }

    return savedFile;
  }

  async deleteFile(payload: IFileDeletePayload) {
    const { fileId } = payload;
    const file = await this.fileRepository.findOneBy({ id: fileId });

    if (!file) {
      throw new Error(`File with id ${fileId} not found}`);
    }

    await this.fileRepository.delete(file);
    await rm(file.url, { force: true });
    return true;
  }
}
