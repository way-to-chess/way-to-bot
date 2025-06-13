import { Router } from "express";
import { AdminEventRouter } from "@way-to-bot/server/admin/routers/event.router.mjs";
import { AdminFileRouter } from "@way-to-bot/server/admin/routers/file.router.mjs";
import { AdminLeagueRouter } from "@way-to-bot/server/admin/routers/league.router.mjs";
import { AdminLocationRouter } from "@way-to-bot/server/admin/routers/location.router.mjs";
import { AdminParticipateRequestRouter } from "@way-to-bot/server/admin/routers/participate-request.router.mjs";
import { AdminUserRouter } from "@way-to-bot/server/admin/routers/user.router.mjs";
import { AdminEventLeagueRouter } from "@way-to-bot/server/admin/routers/event-league.router.js";
import { AdminTgRouter } from "@way-to-bot/server/admin/routers/tg.router.mjs";

export const AdminRouter = Router();

AdminRouter.use("/event", AdminEventRouter);
AdminRouter.use("/file", AdminFileRouter);
AdminRouter.use("/league", AdminLeagueRouter);
AdminRouter.use("/location", AdminLocationRouter);
AdminRouter.use("/participate-request", AdminParticipateRequestRouter);
AdminRouter.use("/user", AdminUserRouter);
AdminRouter.use("/event-league", AdminEventLeagueRouter);
AdminRouter.use("/tg", AdminTgRouter);
