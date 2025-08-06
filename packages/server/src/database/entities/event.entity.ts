import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";
import { LocationEntity } from "./location.entity";
import { FileEntity } from "./file.entity";
import { EventLeagueEntity } from "@way-to-bot/server/database/entities/event-league.entity";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity";
import type { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity";
import { EEventStatus } from "@way-to-bot/shared/api/enums/EEventStatus";
import { EEventType } from "@way-to-bot/shared/api/enums/EEventType";

@Entity("events")
export class EventEntity implements IEventEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 128 })
  name!: string;

  @Column({ type: "timestamp", name: "date_time" })
  dateTime!: Date;

  @Column({ type: "int", nullable: true })
  duration?: number | null;

  @Column({ type: "varchar", length: 32, nullable: true })
  price?: string | null;

  @Column({ type: "varchar", nullable: true })
  description?: string | null;

  @Column({
    default: EEventStatus.WAITING,
    type: "enum",
    enum: EEventStatus,
  })
  status!: EEventStatus;

  @Column({ type: "enum", enum: EEventType, default: EEventType.OTHER })
  type!: EEventType;

  @Column({ type: "varchar", nullable: true })
  city?: string | null;

  @Column({ type: "int", nullable: true, name: "participants_limit" })
  participantsLimit?: number | null;

  @Column({ type: "varchar", nullable: true, name: "link_to_stream" })
  linkToStream?: string | null;

  @Column({ name: "location_id", nullable: true, type: "int" })
  locationId?: number | null;

  @ManyToOne(() => LocationEntity, { nullable: true })
  @JoinColumn({ name: "location_id" })
  location?: Relation<LocationEntity> | null;

  @Column({ name: "file_id", nullable: true, type: "int" })
  fileId?: number | null;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: "file_id" })
  preview?: Relation<FileEntity> | null;

  @OneToMany(() => EventLeagueEntity, (el: EventLeagueEntity) => el.event)
  eventLeagues?: Relation<EventLeagueEntity[]>;

  @OneToMany(
    () => ParticipateRequestEntity,
    (pr: ParticipateRequestEntity) => pr.event,
  )
  participateRequests?: Relation<ParticipateRequestEntity[]>;

  @Column({ name: "host_id", type: "int", nullable: false })
  hostId!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "host_id" })
  host!: Relation<UserEntity>;

  @Column({ name: "additional_info", type: "jsonb", nullable: true })
  additionalInfo?: Record<string, unknown> | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
