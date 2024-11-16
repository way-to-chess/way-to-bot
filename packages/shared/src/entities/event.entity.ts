import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LocationEntity } from "./location.entity";
import { EventUserLeagueEntity } from "./events_users_leagues";
import { FileEntity } from "./file.entity";
import { EEventStatus } from "../enums";

@Entity("events")
export class EventEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: true })
  name?: string | null = null;

  @Column({ type: "timestamp", name: "date_time" })
  dateTime!: Date;

  @Column({ type: "varchar", nullable: true })
  price: string | null = null;

  @Column({
    default: EEventStatus.WAITING,
    type: "enum",
    enum: EEventStatus,
  })
  status!: EEventStatus;

  @Column({ type: "int", nullable: true, name: "participants_limit" })
  participantsLimit: number | null = null;

  @Column({ type: "varchar", nullable: true, name: "link_to_table" })
  linkToTable: string | null = null;

  @ManyToOne(() => LocationEntity, { nullable: true })
  @JoinColumn({ name: "location_id" })
  location: LocationEntity | null = null;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: "file_id" })
  preview: FileEntity | null = null;

  @OneToMany(() => EventUserLeagueEntity, (eul) => eul.event)
  eventsUsersLeagues!: EventUserLeagueEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
