import {LeagueEntity} from "@way-to-bot/shared/entities/league.entity";

export interface ILeagueCreatePayload
    extends Partial<Omit<LeagueEntity, "id">> {
}

export interface ILeagueUpdatePayload extends Partial<LeagueEntity> {
}

export interface ILeagueDeletePayload {
    leagueId: number;
}
