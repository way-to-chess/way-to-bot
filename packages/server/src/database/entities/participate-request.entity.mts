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
import { IParticipateRequestEntity } from "@way-to-bot/shared/api/interfaces/entities/participate-request-entity.interface.js";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";
import { TCommonParticipateRequestAdditionalUser } from "@way-to-bot/shared/api/types/index.js";
import { EParticipateRequestPaymentType } from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import { EParticipateRequestStatus } from "@way-to-bot/shared/api/enums/EParticipateRequestStatus";

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

  @Column({ type: "jsonb", default: [], name: "additional_users" })
  additionalUsers!: TCommonParticipateRequestAdditionalUser[];

  @Column({ name: "file_id", nullable: true, type: "int" })
  fileId?: number | null;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: "file_id" })
  receipt?: Relation<FileEntity> | null;

  @Column({
    type: "enum",
    enum: EParticipateRequestStatus,
    nullable: false,
    default: EParticipateRequestStatus.WAITING,
  })
  status!: EParticipateRequestStatus;

  @Column({
    name: "payment_type",
    type: "enum",
    enum: EParticipateRequestPaymentType,
    nullable: false,
    default: EParticipateRequestPaymentType.CASH,
  })
  paymentType!: EParticipateRequestPaymentType;

  @Column({ name: "message", type: "text", nullable: true })
  message?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
