import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
  VirtualColumn,
} from "typeorm";
import { FileEntity } from "@way-to-bot/server/database/entities/file.entity.mjs";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity.mjs";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { TCommonContactInfo } from "@way-to-bot/shared/api/types/index.js";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error.mjs";
import { EUserRole } from "@way-to-bot/shared/api/enums/EUserRole.js";

@Entity("users")
export class UserEntity implements IUserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true, nullable: true, length: 64 })
  username?: string | null = null;

  @Column({ type: "bigint", unique: true, nullable: true, name: "tg_id" })
  tgId?: string | null = null;

  @Column({ type: "varchar", length: 255, unique: true, nullable: true })
  email?: string | null;

  @Column({ type: "varchar", length: 50, name: "first_name", nullable: true })
  firstName?: string | null;

  @Column({ type: "varchar", length: 50, name: "last_name", nullable: true })
  lastName?: string | null;

  @Column({ type: "date", nullable: true, name: "birth_date" })
  birthDate?: Date;

  @VirtualColumn({
    type: "integer",
    query: (alias: string) => `
      EXTRACT(YEAR FROM AGE(${alias}.birth_date))::integer
    `,
  })
  age?: number;

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
    if (this.username !== undefined && this.username !== null) {
      this.username = this.username.trim();

      if (!this.username || this.username === "") {
        throw new BadRequestError("Username is required");
      }

      this.username =
        this.username.charAt(0) === "@" ? this.username : "@" + this.username;
    }

    if (this.firstName !== undefined && this.firstName !== null) {
      this.firstName = this.firstName.trim();

      if (!this.firstName || this.firstName === "") {
        throw new BadRequestError("First name is required");
      }
    }

    if (this.lastName !== undefined && this.lastName !== null) {
      this.lastName = this.lastName.trim();

      if (!this.lastName || this.lastName === "") {
        throw new BadRequestError("Last name is required");
      }
    }
  }
}
