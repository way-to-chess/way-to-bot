import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from "typeorm";
import { FileEntity } from "./file.entity";
import { EventEntity } from "./event.entity";
import { UserEntity } from "./user.entity";

@Entity("participate_requests")
@Unique(["event", "user"])
export class ParticipateRequestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => EventEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "event_id" })
  event!: EventEntity;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: "file_id" })
  receipt?: FileEntity | null;

  @Column({ nullable: false, type: "boolean" })
  approved: boolean = false;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
