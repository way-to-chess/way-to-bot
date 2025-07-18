import { Router } from "express";
import { AdminEventRouter } from "@way-to-bot/server/admin/routers/event.router";
import { AdminFileRouter } from "@way-to-bot/server/admin/routers/file.router";
import { AdminLeagueRouter } from "@way-to-bot/server/admin/routers/league.router";
import { AdminLocationRouter } from "@way-to-bot/server/admin/routers/location.router";
import { AdminParticipateRequestRouter } from "@way-to-bot/server/admin/routers/participate-request.router";
import { AdminUserRouter } from "@way-to-bot/server/admin/routers/user.router";
import { AdminEventLeagueRouter } from "@way-to-bot/server/admin/routers/event-league.router";
import { AdminTgRouter } from "@way-to-bot/server/admin/routers/tg.router";

export const AdminRouter = Router();

AdminRouter.use("/event", AdminEventRouter);
AdminRouter.use("/file", AdminFileRouter);
AdminRouter.use("/league", AdminLeagueRouter);
AdminRouter.use("/location", AdminLocationRouter);
AdminRouter.use("/participate-request", AdminParticipateRequestRouter);
AdminRouter.use("/user", AdminUserRouter);
AdminRouter.use("/event-league", AdminEventLeagueRouter);
AdminRouter.use("/tg", AdminTgRouter);
