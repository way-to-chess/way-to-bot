import { FileEntity } from "../database/entities/file.entity";
import { setFileUrlForClient } from "../utils/set-file-url-for-client";

export class FileDTO {
  id: number;
  url: string;

  constructor(file: FileEntity) {
    this.id = file.id;
    this.url = setFileUrlForClient(file.url);
  }
}
