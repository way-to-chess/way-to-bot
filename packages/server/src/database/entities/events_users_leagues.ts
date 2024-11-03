import {Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import { EventEntity } from "./event.entity";
import { UserEntity } from "./user.entity";
import { LeagueEntity } from "./league.entity";

@Entity("event_user_league")
@Unique(["event", "user", "league"])
export class EventUserLeagueEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => EventEntity, (event) => event.eventsUsersLeagues, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "event_id" })
  event!: EventEntity;

  @ManyToOne(() => UserEntity, (user) => user.eventsUsersLeagues, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => LeagueEntity, (league) => league.eventsUsersLeagues, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "league_id" })
  league!: LeagueEntity;
}
