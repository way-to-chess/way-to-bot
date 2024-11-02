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
} from "typeorm";
import { FileEntity } from "./file.entity";
import { EUserRole } from "../../enums";
import { EventUserLeagueEntity } from "./events_users_leagues";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  username!: string;

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
    this.total = this.wins + this.losses + this.draws;

    if (this.wins || this.losses) {
      this.winRate = this.wins / (this.wins + this.losses);
    } else {
      this.winRate = 0;
    }
  }
}
