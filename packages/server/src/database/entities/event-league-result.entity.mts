import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { FileEntity } from "@way-to-bot/server/database/entities/file.entity.mjs";
import { EventLeagueEntity } from "@way-to-bot/server/database/entities/event-league.entity.mjs";
import { IEventLeagueResult } from "@way-to-bot/shared/api/interfaces/entities/event-league-result-entity.interface.js";

@Entity("event_league_results")
export class EventLeagueResultEntity implements IEventLeagueResult {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "int",
    nullable: false,
    name: "event_league_id",
    unique: true,
  })
  eventLeagueId!: number;

  @OneToOne(() => EventLeagueEntity)
  @JoinColumn({ name: "event_league_id" })
  eventLeague!: Relation<EventLeagueEntity>;

  @Column({ type: "int", nullable: true, name: "rounds_file_id" })
  roundsFileId?: number;

  @OneToOne(() => FileEntity)
  @JoinColumn({ name: "rounds_file_id" })
  roundsFile?: Relation<FileEntity>;

  @Column({ type: "int", nullable: true, name: "rating_file_id" })
  ratingFileId?: number;

  @OneToOne(() => FileEntity)
  @JoinColumn({ name: "rating_file_id" })
  ratingFile?: Relation<FileEntity>;
}
