import { ILocationEntity } from "@way-to-bot/shared/api/interfaces/entities/location-entity.interface.js";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";

import { ELocationBenefits } from "../../enums/ELocationBenefits";

export class BaseDTOLocation {
  readonly id: number;
  readonly title: string;
  readonly url: string | null;
  readonly address: string | null;
  readonly fileId: number | null;
  readonly preview: IFileEntity | null;
  readonly benefits: ELocationBenefits[];

  constructor(location: ILocationEntity) {
    this.id = location.id;
    this.title = location.title;
    this.url = location.url ?? null;
    this.address = location.address ?? null;
    this.fileId = location.fileId ?? null;
    this.preview = location.preview ?? null;
    this.benefits = location.benefits;
  }
}
