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

  @Column({ type: "int", nullable: true })
  place?: number;

  @AfterInsert()
  async createUserLeague() {
    const eventLeagueRepository = dbInstance.getRepository(EventsLeaguesEntity);

    const eventLeague = await eventLeagueRepository.findOne({
      where: { league: { id: this.league.id }, event: { id: this.event.id } },
    });

    if (!eventLeague) {
      const newEventLeague = eventLeagueRepository.create({
        league: this.league,
        event: this.event,
      });

      await eventLeagueRepository.save(newEventLeague);
    }
  }
}
