import { Entity, PrimaryGeneratedColumn, Column, AfterLoad } from "typeorm";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import * as process from "node:process";

@Entity("files")
export class FileEntity implements IFileEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  url!: string;

  @Column({ type: "varchar", nullable: true })
  previewUrl?: string | null = null;

  @AfterLoad()
  setUrl() {
    this.url = this.url.replace(process.env.PATH_TO_UPLOADS!, "uploads/");
    if (this.previewUrl) {
      this.previewUrl = this.previewUrl.replace(
        process.env.PATH_TO_UPLOADS!,
        "uploads/",
      );
    }
  }
}
