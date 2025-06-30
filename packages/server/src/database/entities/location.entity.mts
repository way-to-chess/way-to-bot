import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";
import { FileEntity } from "@way-to-bot/server/database/entities/file.entity.mjs";
import { ILocationEntity } from "@way-to-bot/shared/api/interfaces/entities/location-entity.interface.js";

import { ELocationBenefits } from "@way-to-bot/shared/api/enums/ELocationBenefits";

@Entity("locations")
export class LocationEntity implements ILocationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ nullable: true, type: "varchar" })
  url?: string | null;

  @Column({ nullable: true, type: "varchar", length: 255 })
  address?: string | null;

  @Column({
    type: "enum",
    nullable: false,
    array: true,
    enum: ELocationBenefits,
    default: [],
  })
  benefits!: ELocationBenefits[];

  @Column({ name: "file_id", nullable: true, type: "int" })
  fileId?: number | null;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: "file_id" })
  preview?: Relation<FileEntity> | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
