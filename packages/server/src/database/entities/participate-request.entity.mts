import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  type Relation,
} from "typeorm";
import { FileEntity } from "@way-to-bot/server/database/entities/file.entity.mjs";
import { IParticipateRequestEntity } from "@way-to-bot/shared/api/interfaces/entities/participate-request-entity.interface.js";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";
import { TCommonParticipateRequestAdditionalUser } from "@way-to-bot/shared/api/types/index.js";

@Entity("participate_requests")
export class ParticipateRequestEntity implements IParticipateRequestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "event_id", type: "int" })
  eventId!: number;

  @ManyToOne(() => EventEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event!: Relation<EventEntity>;

  @Column({ name: "user_id", type: "int" })
  userId!: number;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: Relation<UserEntity>;

  @Column({ type: "jsonb", default: [] })
  additionalUsers!: TCommonParticipateRequestAdditionalUser[];

  @Column({ name: "file_id", nullable: true, type: "int" })
  fileId?: number | null;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: "file_id" })
  receipt?: Relation<FileEntity> | null;

  @Column({ nullable: false, type: "boolean" })
  approved: boolean = false;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
