import { Router } from "express";
import { AdminRouter } from "@way-to-bot/server/admin/routers/index.mjs";
import { ClientRouter } from "@way-to-bot/server/client/routers/index.mjs";
import { AuthRouter } from "@way-to-bot/server/express/routers/auth/auth.router.mjs";
import { authMddw } from "@way-to-bot/server/express/middlewares/auth.mddw.mjs";
import { adminRoleMddw } from "@way-to-bot/server/express/middlewares/admin-role.mddw.mjs";

export const MainRouter = Router();

MainRouter.use("/auth", AuthRouter);
MainRouter.use("/admin", authMddw, adminRoleMddw, AdminRouter);
MainRouter.use("/client", ClientRouter);
