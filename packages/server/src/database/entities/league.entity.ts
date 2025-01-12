import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EventUserLeagueEntity } from "./events-users-leagues";
import { EventsLeaguesEntity } from "./events-leagues";

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
