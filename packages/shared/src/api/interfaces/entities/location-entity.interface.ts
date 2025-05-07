import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";

export interface ILocationEntity {
  id: number;
  title: string;
  url?: string | null;
  address?: string | null;
  fileId?: number | null;
  preview?: IFileEntity | null;
  createdAt: Date;
  updatedAt: Date;
}
