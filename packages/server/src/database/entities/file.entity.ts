import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("files")
export class File {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", nullable: false })
  url!: string;
}
