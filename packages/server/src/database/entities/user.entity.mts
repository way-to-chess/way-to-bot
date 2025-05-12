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
  type Relation,
} from "typeorm";
import { FileEntity } from "@way-to-bot/server/database/entities/file.entity.mjs";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";
import { EUserRole } from "@way-to-bot/shared/api/enums/index.js";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity.mjs";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { TCommonContactInfo } from "@way-to-bot/shared/api/types/index.js";

@Entity("users")
@Unique(["username", "firstName", "lastName"])
export class UserEntity implements IUserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { unique: true, nullable: true, length: 255 })
  username?: string | null = null;

  @Column("bigint", { unique: true, nullable: true, name: "tg_id" })
  tgId?: string | null = null;

  @Column({ type: "varchar", length: 255 })
  firstName!: string;

  @Column({ type: "varchar", length: 255 })
  lastName!: string;

  @Column("enum", {
    nullable: false,
    array: true,
    enum: EUserRole,
    default: [EUserRole.USER],
  })
  roles!: EUserRole[];

  @Column({ type: "jsonb", name: "contact_info", nullable: false, default: [] })
  contactInfo!: TCommonContactInfo[];

  @Column({ name: "file_id", nullable: true, type: "int" })
  fileId?: number | null;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: "file_id" })
  photo?: Relation<FileEntity> | null;

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

  @OneToMany(
    () => ParticipateRequestEntity,
    (pr: ParticipateRequestEntity) => pr.user,
  )
  participateRequests!: Relation<ParticipateRequestEntity[]>;

  @OneToMany(
    () => EventLeagueUserEntity,
    (elu: EventLeagueUserEntity) => elu.user,
  )
  eventLeagues!: Relation<EventLeagueUserEntity[]>;

  @BeforeInsert()
  @BeforeUpdate()
  calculateWinRateAndTotal() {
    this.total = this.wins + this.losses + this.draws;

    if (this.wins || this.losses) {
      const winRate = (this.wins / (this.wins + this.losses)) * 100;
      this.winRate = Math.round(winRate * 100) / 100;
    } else {
      this.winRate = 0;
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  trimValues() {
    if (this.username) {
      this.username = this.username.trim();
      this.username =
        this.username.charAt(0) === "@" ? this.username : "@" + this.username;
    }

    if (this.firstName) {
      this.firstName = this.firstName.trim();
    }

    if (this.lastName) {
      this.lastName = this.lastName.trim();
    }
  }
}
