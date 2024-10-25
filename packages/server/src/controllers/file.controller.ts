import { Body, Delete, Post, Route, Tags } from "tsoa";
import { FileService } from "../services/file.service";
import { IFileDeletePayload } from "packages/shared/src/interfaces/file.interface";

@Route("/api/file")
@Tags("Files")
export class FileController {
  private fileService = new FileService();

  @Post("/upload")
  async addFile(payload: Express.Multer.File) {
    return this.fileService.addFile(payload);
  }

  @Delete("/delete")
  async deleteFile(@Body() payload: IFileDeletePayload) {
    return this.fileService.deleteFile(payload);
  }
}
