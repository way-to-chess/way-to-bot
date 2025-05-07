import { ILocationEntity } from "@way-to-bot/shared/api/interfaces/entities/location-entity.interface.js";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";

export class BaseDTOLocation {
  readonly id: number;
  readonly title: string;
  readonly url: string | null;
  readonly address: string | null;
  readonly fileId: number | null;
  readonly preview: IFileEntity | null;

  constructor(location: ILocationEntity) {
    this.id = location.id;
    this.title = location.title;
    this.url = location.url ?? null;
    this.address = location.address ?? null;
    this.fileId = location.fileId ?? null;
    this.preview = location.preview ?? null;
  }
}
