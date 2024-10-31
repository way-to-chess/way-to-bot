import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { File } from "./file.entity";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ nullable: true, type: "varchar" })
  url?: string | null;

  @Column({ nullable: true, type: "varchar" })
  address?: string | null;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: "file_id" })
  preview!: File | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
