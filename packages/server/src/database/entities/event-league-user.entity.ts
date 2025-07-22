import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
} from "typeorm";
import { IEventLeagueUserEntity } from "@way-to-bot/shared/api/interfaces/entities/event-league-user-entity.interface";
import { EventLeagueEntity } from "@way-to-bot/server/database/entities/event-league.entity";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity";

@Entity("events_leagues_users")
@Unique(["eventLeague", "user"])
export class EventLeagueUserEntity implements IEventLeagueUserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "user_id", type: "int" })
  userId!: number;

  @ManyToOne(() => UserEntity, (u) => u.eventLeagues, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: Relation<UserEntity>;

  @Column({ name: "event_league_id", type: "int" })
  eventLeagueId!: number;

  @ManyToOne(() => EventLeagueEntity, (el) => el.participants, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "event_league_id" })
  eventLeague!: Relation<EventLeagueEntity>;

  @Column({ type: "int", nullable: true })
  place?: number | null;

  @Column({ type: "int", nullable: true })
  points?: number | null;
}
