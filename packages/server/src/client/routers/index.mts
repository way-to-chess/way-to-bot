import { Router } from "express";
import { ClientEventRouter } from "@way-to-bot/server/client/routers/event.router.mjs";
import { ClientParticipateRequestRouter } from "@way-to-bot/server/client/routers/participate-request.router.mjs";
import { ClientUserRouter } from "@way-to-bot/server/client/routers/user.router.mjs";
import { authMddw } from "@way-to-bot/server/express/middlewares/auth.mddw.mjs";
import { ClientFileRouter } from "@way-to-bot/server/client/routers/file.router.mjs";

export const ClientRouter = Router();

ClientRouter.use("/event", ClientEventRouter);
ClientRouter.use(
  "/participate-request",
  authMddw,
  ClientParticipateRequestRouter,
);
ClientRouter.use("/user", ClientUserRouter);
ClientRouter.use("/file", ClientFileRouter);
