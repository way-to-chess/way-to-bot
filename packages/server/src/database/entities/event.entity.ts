import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { EEventStatus } from "@enums";
import { Location } from "./location.entity";
import { User } from "./user.entity";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamp", name: "date_time" })
  dateTime!: Date;

  @Column({ type: "varchar", nullable: true })
  price?: string | null;

  @Column({
    default: EEventStatus.WAITING,
    type: "enum",
    enum: EEventStatus,
  })
  status!: EEventStatus;

  @Column({ type: "int", nullable: true, name: "participants_limit" })
  participantsLimit?: number | null;

  @Column({ type: "varchar", nullable: true, name: "link_to_table" })
  linkToTable?: string | null;

  @ManyToOne(() => Location)
  @JoinColumn({ name: "location_id" })
  location?: Location | null;

  @ManyToMany(() => User, (user) => user.events)
  @JoinTable()
  users: User[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
