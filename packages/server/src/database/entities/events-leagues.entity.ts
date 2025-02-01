import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { EventEntity } from "./event.entity";
import { LeagueEntity } from "./league.entity";

@Entity("event_league")
@Unique(["event", "league"])
export class EventsLeaguesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "event_id" })
  eventId!: number;

  @ManyToOne(() => EventEntity, (event) => event.leaguesResults, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "event_id" })
  event!: EventEntity;

  @Column({ name: "league_id" })
  leagueId!: number;

  @ManyToOne(() => LeagueEntity, (league) => league.eventsLeaguesResults, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "league_id" })
  league!: LeagueEntity;

  @Column({ type: "text", nullable: true })
  link?: string;
}
