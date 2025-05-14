import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  type Relation,
} from "typeorm";
import { EventLeagueEntity } from "@way-to-bot/server/database/entities/event-league.entity.mjs";
import { ILeagueEntity } from "@way-to-bot/shared/api/interfaces/entities/league-entity.interface.js";

@Entity("leagues")
export class LeagueEntity implements ILeagueEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 64, unique: true })
  name!: string;

  @OneToMany(() => EventLeagueEntity, (el: EventLeagueEntity) => el.league)
  eventLeagues?: Relation<EventLeagueEntity[]>;
}
