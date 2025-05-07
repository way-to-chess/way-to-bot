import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
} from "typeorm";
import type { IEventLeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-entity.interface.js";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { LeagueEntity } from "@way-to-bot/server/database/entities/league.entity.mjs";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity.mjs";

@Entity("events_leagues")
@Unique(["event", "league"])
export class EventLeagueEntity implements IEventLeagueEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "event_id", type: "int" })
  eventId!: number;

  @ManyToOne(() => EventEntity, (e) => e.eventLeagues, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "event_id" })
  event!: Relation<EventEntity>;

  @Column({ name: "league_id", type: "int" })
  leagueId!: number;

  @ManyToOne(() => LeagueEntity, (l) => l.eventLeagues, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "league_id" })
  league!: Relation<LeagueEntity>;

  @OneToMany(() => EventLeagueUserEntity, (elu) => elu.eventLeague)
  participants!: Relation<EventLeagueUserEntity[]>;

  @Column({ type: "varchar", nullable: true })
  link?: string | null;
}
