import { Router } from "express";
import { UserRouter } from "./user.router";
import { EventRouter } from "./event.router";
import { LocationRouter } from "./location.router";
import { FileRouter } from "./file.router";
import { LeagueRouter } from "./league.router";

export const MainRouter = Router();

MainRouter.use("/user", UserRouter);
MainRouter.use("/event", EventRouter);
MainRouter.use("/location", LocationRouter);
MainRouter.use("/league", LeagueRouter);
MainRouter.use("/file", FileRouter);
