import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("files")
export class File {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  url!: string;
}
