import {dbInstance} from "../database/init";
import {DeepPartial} from "typeorm";
import {LeagueEntity} from "@way-to-bot/shared/entities/league.entity";
import {ILeagueCreatePayload, ILeagueDeletePayload, ILeagueUpdatePayload,} from "../interfaces/league.interface";

export class LeagueService {
    private leagueRepository = dbInstance.getRepository(LeagueEntity);

    getAllLeagues = () => {
        return this.leagueRepository.find();
    };

    createLeague = async (league: ILeagueCreatePayload) => {
        const newLeague = this.leagueRepository.create(
            league as DeepPartial<LeagueEntity>,
        );
        return this.leagueRepository.save(newLeague);
    };

    updateLeague = async (league: ILeagueUpdatePayload) => {
        const existingLeague = await this.leagueRepository.findOneBy({
            id: league.id!,
        });

        if (!existingLeague) {
            throw new Error(`League with id ${league.id} not found`);
        }

        const updatedLeague = this.leagueRepository.merge(
            existingLeague,
            league as DeepPartial<LeagueEntity>,
        );

        return this.leagueRepository.save(updatedLeague);
    };

    deleteLeague = async (payload: ILeagueDeletePayload) => {
        const {leagueId} = payload;
        const existingLeague = await this.leagueRepository.findOneBy({
            id: leagueId,
        });

        if (!existingLeague) {
            throw new Error(`League with id ${leagueId} not found`);
        }

        const leagueDeleted = await this.leagueRepository.delete(leagueId);

        return leagueDeleted.affected === 1;
    };
}
