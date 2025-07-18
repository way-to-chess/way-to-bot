import { Router } from "express";
import { AdminRouter } from "@way-to-bot/server/admin/routers/index";
import { ClientRouter } from "@way-to-bot/server/client/routers/index";
import { AuthRouter } from "@way-to-bot/server/express/routers/auth/auth.router";
import { authMddw } from "@way-to-bot/server/express/middlewares/auth.mddw";
import { adminRoleMddw } from "@way-to-bot/server/express/middlewares/admin-role.mddw";

export const MainRouter = Router();

MainRouter.use("/auth", AuthRouter);
MainRouter.use("/admin", authMddw, adminRoleMddw, AdminRouter);
MainRouter.use("/client", ClientRouter);
