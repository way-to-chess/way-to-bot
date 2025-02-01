import {
  AfterInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { EventEntity } from "./event.entity";
import { UserEntity } from "./user.entity";
import { LeagueEntity } from "./league.entity";
import { dbInstance } from "../init";
import { EventsLeaguesEntity } from "./events-leagues.entity";

@Entity("event_user_league")
@Unique(["event", "user", "league"])
export class EventUserLeagueEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "event_id" })
  eventId!: number;

  @ManyToOne(() => EventEntity, (event) => event.eventsUsersLeagues, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "event_id" })
  event!: EventEntity;

  @Column({ name: "user_id" })
  userId!: number;

  @ManyToOne(() => UserEntity, (user) => user.eventsUsersLeagues, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ name: "league_id" })
  leagueId!: number;

  @ManyToOne(() => LeagueEntity, (league) => league.eventsUsersLeagues, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "league_id" })
  league!: LeagueEntity;

  @Column({ type: "int", nullable: true })
  place?: number;

  @AfterInsert()
  async createUserLeague() {
    const eventLeagueRepository = dbInstance.getRepository(EventsLeaguesEntity);

    const eventLeague = await eventLeagueRepository.findOne({
      where: { leagueId: this.leagueId, eventId: this.eventId },
    });

    if (!eventLeague) {
      const newEventLeague = eventLeagueRepository.create({
        leagueId: this.leagueId,
        eventId: this.eventId,
      });

      await eventLeagueRepository.save(newEventLeague);
    }
  }
}
