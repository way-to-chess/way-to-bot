import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { ELocationBenefits } from "@way-to-bot/shared/api/enums/index.js";

export interface ILocationEntity {
  id: number;
  title: string;
  url?: string | null;
  address?: string | null;
  benefits: ELocationBenefits[];
  fileId?: number | null;
  preview?: IFileEntity | null;
  createdAt: Date;
  updatedAt: Date;
}
