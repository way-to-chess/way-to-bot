import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { setFileUrlForClient } from "../utils/setFileUrlForClient";

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
