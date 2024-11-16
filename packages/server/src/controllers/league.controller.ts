import { Body, Delete, Get, Post, Put, Route, Tags } from "tsoa";
import { LeagueService } from "../services/league.service";

import {
  ILeagueCreatePayload,
  ILeagueDeletePayload,
  ILeagueUpdatePayload,
} from "@way-to-bot/shared/interfaces/league.interface";

@Route("/api/league")
@Tags("Leagues")
export class LeagueController {
  private leagueService = new LeagueService();

  @Get("/all")
  async getAllLeagues() {
    return this.leagueService.getAllLeagues();
  }

  @Post("/create")
  async createLeague(@Body() payload: ILeagueCreatePayload) {
    return this.leagueService.createLeague(payload);
  }

  @Put("/update")
  async updateLeague(@Body() payload: ILeagueUpdatePayload) {
    return this.leagueService.updateLeague(payload);
  }

  @Delete("/delete")
  async deleteLeague(@Body() payload: ILeagueDeletePayload) {
    return this.leagueService.deleteLeague(payload);
  }
}
