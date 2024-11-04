import { FileEntity } from "../database/entities/file.entity";
import * as path from "path";
import { rm } from "fs/promises";
import { dbInstance } from "../database/init";
import { IFileDeletePayload } from "../interfaces/file.interface";
import { FileDTO } from "../DTO/file.DTO";

export class FileService {
  private fileRepository = dbInstance.getRepository(FileEntity);

  async addFile(file: Express.Multer.File) {
    if (!file.destination || !file.filename) {
      throw new Error("No destination or filename, data corrupted");
    }

    const newFile = new FileEntity();
    newFile.url = path.join(file.destination, file.filename);

    const savedFile = await this.fileRepository.save(newFile);
    if (!savedFile) {
      throw new Error("File was not saved, please try again");
    }

    return new FileDTO(savedFile);
  }

  async deleteFile(payload: IFileDeletePayload) {
    const { fileId } = payload;
    const file = await this.fileRepository.findOneBy({ id: fileId });

    if (!file) {
      throw new Error(`File with id ${fileId} not found}`);
    }

    await this.fileRepository.delete(file.id);
    await rm(file.url, { force: true });
    return true;
  }
}
