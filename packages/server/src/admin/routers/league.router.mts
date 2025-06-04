import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminLeagueController } from "@way-to-bot/server/admin/controllers/league.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import {
  AdminSchemaLeagueCreate,
  AdminSchemaLeagueUpdate,
} from "@way-to-bot/shared/api/zod/admin/league.schema.js";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw.mjs";

export const AdminLeagueRouter = Router();
const adminLeagueController = DiContainer.get(AdminLeagueController);

AdminLeagueRouter.get("/", getManyOptionsMddw, (req, res) =>
  adminLeagueController.getMany(req, res),
);

AdminLeagueRouter.get("/:id", (req, res) =>
  adminLeagueController.getOne(req, res),
);

AdminLeagueRouter.post(
  "/",
  validatePayloadMddw(AdminSchemaLeagueCreate),
  (req, res) => adminLeagueController.create(req, res),
);

AdminLeagueRouter.patch(
  "/:id",
  validatePayloadMddw(AdminSchemaLeagueUpdate),
  (req, res) => adminLeagueController.update(req, res),
);

AdminLeagueRouter.delete("/:id", (req, res) =>
  adminLeagueController.delete(req, res),
);
