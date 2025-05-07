import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";

export class BaseDTOFile {
  readonly id: number;
  readonly url: string;
  readonly previewUrl: string | null;

  constructor(file: IFileEntity) {
    this.id = file.id;
    this.url = file.url;
    this.previewUrl = file.previewUrl ?? null;
  }
}
