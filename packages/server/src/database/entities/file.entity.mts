import {Entity, PrimaryGeneratedColumn, Column, AfterLoad, BeforeInsert, BeforeUpdate} from "typeorm";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import * as process from "node:process";
import path from "path";

@Entity("files")
export class FileEntity implements IFileEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  url!: string;

  @Column({ type: "varchar", nullable: true })
  previewUrl?: string | null = null;

  @BeforeInsert()
  @BeforeUpdate()
  setUrl() {
    this.url = path.join(
      this.url.replace(process.env.PATH_TO_UPLOADS!, "uploads/"),
    );
    if (this.previewUrl) {
      this.previewUrl = path.join(
        this.previewUrl.replace(process.env.PATH_TO_UPLOADS!, "uploads/"),
      );
    }
  }
}
