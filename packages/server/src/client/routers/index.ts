import { Router } from "express";
import { ClientEventRouter } from "@way-to-bot/server/client/routers/event.router";
import { ClientParticipateRequestRouter } from "@way-to-bot/server/client/routers/participate-request.router";
import { ClientUserRouter } from "@way-to-bot/server/client/routers/user.router";
import { ClientFileRouter } from "@way-to-bot/server/client/routers/file.router";

export const ClientRouter = Router();

ClientRouter.use("/event", ClientEventRouter);
ClientRouter.use("/participate-request", ClientParticipateRequestRouter);
ClientRouter.use("/user", ClientUserRouter);
ClientRouter.use("/file", ClientFileRouter);
