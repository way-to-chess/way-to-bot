import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";
import { FileEntity } from "./file.entity";
import { EUserRole } from "../../enums";
import { EventUserLeagueEntity } from "./events-users-leagues";

@Entity("users")
@Unique(["username", "firstName", "lastName"])
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { unique: true, nullable: true })
  username?: string | null = null;

  @Column("int", { unique: true, nullable: true, name: "tg_id" })
  tgId?: number | null = null;

  @Column({ type: "varchar" })
  firstName!: string;

  @Column({ type: "varchar" })
  lastName!: string;

  @Column("enum", {
    nullable: false,
    array: true,
    enum: EUserRole,
    default: [EUserRole.USER],
  })
  roles!: EUserRole[];

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: "file_id" })
  photo!: FileEntity | null;

  @Column("int", { nullable: false, default: 0 })
  wins: number = 0;

  @Column("int", { nullable: false, default: 0 })
  losses: number = 0;

  @Column("int", { nullable: false, default: 0 })
  draws: number = 0;

  @Column("int", { nullable: false, default: 0 })
  total: number = 0;

  @Column({ nullable: false, default: 0, name: "win_rate", type: "float" })
  winRate: number = 0;

  @Column("int", { nullable: false, default: 0 })
  rating: number = 0;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToMany(() => EventUserLeagueEntity, (eul) => eul.user)
  eventsUsersLeagues!: EventUserLeagueEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  calculateWinRateAndTotal() {
    if (this.username) {
      this.username = this.username.trim();
      this.username =
        this.username.charAt(0) === "@" ? this.username : "@" + this.username;
    }
    this.total = this.wins + this.losses + this.draws;

    if (this.wins || this.losses) {
      const winRate = (this.wins / (this.wins + this.losses)) * 100;
      this.winRate = Math.round(winRate * 100) / 100;
    } else {
      this.winRate = 0;
    }
  }
}
