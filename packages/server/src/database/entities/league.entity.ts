import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EventUserLeagueEntity } from "./events-users-leagues.entity";
import { EventsLeaguesEntity } from "./events-leagues.entity";

@Entity("leagues")
export class LeagueEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @OneToMany(() => EventUserLeagueEntity, (eul) => eul.league)
  eventsUsersLeagues!: EventUserLeagueEntity[];

  @OneToMany(() => EventsLeaguesEntity, (elr) => elr.league)
  eventsLeaguesResults!: EventsLeaguesEntity[];
}
