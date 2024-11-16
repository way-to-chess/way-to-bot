import { Body, Delete, Post, Route, Tags } from "tsoa";
import { FileService } from "../services/file.service";
import {
  IFileDeletePayload,
  IFileUploadPayload,
} from "../interfaces/file.interface";

@Route("/api/file")
@Tags("Files")
export class FileController {
  private fileService = new FileService();

  @Post("/upload")
  async addFile(file: Express.Multer.File, payload: IFileUploadPayload) {
    return this.fileService.addFile(file, payload);
  }

  @Post("importCSV")
  async importCSV(payload: Express.Multer.File) {
    return this.fileService.importCsv(payload);
  }

  @Delete("/delete")
  async deleteFile(@Body() payload: IFileDeletePayload) {
    return this.fileService.deleteFile(payload);
  }
}
