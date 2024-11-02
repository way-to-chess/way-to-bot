import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { EventUserLeagueEntity } from "./events_users_leagues";

@Entity("leagues")
export class LeagueEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @OneToMany(() => EventUserLeagueEntity, (eul) => eul.league)
  eventsUsersLeagues!: EventUserLeagueEntity[];
}
