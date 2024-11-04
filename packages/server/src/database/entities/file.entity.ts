import { Entity, PrimaryGeneratedColumn, Column, AfterLoad } from "typeorm";
import { setFileUrlForClient } from "../../utils/set-file-url-for-client";

@Entity("files")
export class FileEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", nullable: false })
  url!: string;

  @AfterLoad()
  setUrl() {
    this.url = setFileUrlForClient(this.url);
  }
}
