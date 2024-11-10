import {Request, Router} from "express";
import {LeagueController} from "../controllers/league.controller";

import {
    ILeagueCreatePayload,
    ILeagueDeletePayload,
    ILeagueUpdatePayload
} from "@way-to-bot/shared/interfaces/league.interface";

export const LeagueRouter = Router();
const leagueController = new LeagueController();

LeagueRouter.get("/all", async (req, res) => {
    const data = await leagueController.getAllLeagues();
    res.status(200).json({data});
});

LeagueRouter.post(
    "/create",
    async (req: Request<{}, {}, ILeagueCreatePayload>, res) => {
        const data = await leagueController.createLeague(req.body);
        res.status(200).json({data});
    },
);

LeagueRouter.put(
    "/update",
    async (req: Request<{}, {}, ILeagueUpdatePayload>, res) => {
        const data = await leagueController.updateLeague(req.body);
        res.status(200).json({data});
    },
);

LeagueRouter.delete(
    "/delete",
    async (req: Request<{}, {}, ILeagueDeletePayload>, res) => {
        const data = await leagueController.deleteLeague(req.body);
        res.status(200).json({data});
    },
);
