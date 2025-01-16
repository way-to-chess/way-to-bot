import { Body, Delete, FormField, Post, Route, Tags, UploadedFile } from "tsoa";
import { FileService } from "../services/file.service";
import {
  ICsvFileUploadPayload,
  IFileDeletePayload,
  IFileUploadPayload,
} from "../interfaces/file.interface";
import { ECsvAssigment, EImageAssigment } from "../enums";
import { dbInstance } from "../database/init";

@Route("/api/file")
@Tags("Files")
export class FileController {
  private fileService = new FileService();

  @Post("/upload")
  async addFile(
    @UploadedFile() file: Express.Multer.File,
    @FormField() assigment: EImageAssigment,
  ) {
    return this.fileService.addFile(file, assigment);
  }

  @Post("importCSV")
  async importCSV(
    @UploadedFile() file: Express.Multer.File,
    @FormField() assigment: ECsvAssigment,
    @FormField() eventId: number,
    @FormField() leagueId: number,
  ) {
    switch (assigment) {
      case ECsvAssigment.ROUNDS:
        return this.fileService.importCsv(file);
      case ECsvAssigment.RATING:
        return dbInstance.transaction((transaction) => {
          return this.fileService.importCsvRating(
            file,
            { assigment, eventId, leagueId },
            transaction,
          );
        });
    }

    throw new Error("No CSV assigment found");
  }

  @Delete("/delete")
  async deleteFile(@Body() payload: IFileDeletePayload) {
    return this.fileService.deleteFile(payload);
  }
}
