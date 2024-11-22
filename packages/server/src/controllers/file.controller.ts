import { Body, Delete, Post, Route, Tags } from "tsoa";
import { FileService } from "../services/file.service";
import {
  ICsvFileUploadPayload,
  IFileDeletePayload,
  IFileUploadPayload,
} from "../interfaces/file.interface";
import { ECsvAssigment } from "../enums";
import { dbInstance } from "../database/init";

@Route("/api/file")
@Tags("Files")
export class FileController {
  private fileService = new FileService();

  @Post("/upload")
  async addFile(file: Express.Multer.File, payload: IFileUploadPayload) {
    return this.fileService.addFile(file, payload);
  }

  @Post("importCSV")
  async importCSV(file: Express.Multer.File, payload: ICsvFileUploadPayload) {
    switch (payload.assigment) {
      case ECsvAssigment.ROUNDS:
        return this.fileService.importCsv(file);
      case ECsvAssigment.RATING:
        return dbInstance.transaction((transaction) => {
          return this.fileService.importCsvRating(file, payload, transaction);
        });
    }

    throw new Error("No CSV assigment found");
  }

  @Delete("/delete")
  async deleteFile(@Body() payload: IFileDeletePayload) {
    return this.fileService.deleteFile(payload);
  }
}
