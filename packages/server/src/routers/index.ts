import { Router } from "express";
import { UserRouter } from "packages/server/src/routers/user.router";
import { EventRouter } from "packages/server/src/routers/event.router";
import { LocationRouter } from "packages/server/src/routers/location.router";
import { FileRouter } from "packages/server/src/routers/file.router";

export const MainRouter = Router();

MainRouter.use("/user", UserRouter);
MainRouter.use("/event", EventRouter);
MainRouter.use("/location", LocationRouter);
MainRouter.use("/file", FileRouter);
