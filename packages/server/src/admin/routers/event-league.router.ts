import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { AdminEventLeagueController } from "@way-to-bot/server/admin/controllers/event-league.controller";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw";
import {
  AdminSchemaEventLeagueCreate,
  AdminSchemaEventLeagueUsersUpdate,
} from "@way-to-bot/shared/api/zod/admin/event-league.schema";

export const AdminEventLeagueRouter = Router();
const adminEventLeagueController = DiContainer.get(AdminEventLeagueController);

AdminEventLeagueRouter.post(
  "/",
  validatePayloadMddw(AdminSchemaEventLeagueCreate),
  (req, res) => adminEventLeagueController.create(req, res),
);

AdminEventLeagueRouter.delete("/:id", (req, res) =>
  adminEventLeagueController.delete(req, res),
);

AdminEventLeagueRouter.put(
  "/participants-list/:id",
  validatePayloadMddw(AdminSchemaEventLeagueUsersUpdate),
  (req, res) =>
    adminEventLeagueController.updateEventLeagueParticipantsList(req, res),
);
