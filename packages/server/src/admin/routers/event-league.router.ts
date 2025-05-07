import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminEventLeagueController } from "@way-to-bot/server/admin/controllers/event-league.controller.js";
import { validatePayloadMddw } from "@way-to-bot/server/middlewares/validate-payload.mddw.mjs";
import {
  AdminSchemaEventLeagueCreate,
  AdminSchemaEventLeagueUsersUpdate,
} from "@way-to-bot/shared/api/zod/admin/event-league.schema.js";

export const AdminEventLeagueRouter = Router();
const adminEventLeagueController = DiContainer.get(AdminEventLeagueController);

AdminEventLeagueRouter.post(
  "/",
  validatePayloadMddw(AdminSchemaEventLeagueCreate),
  async (req, res) => {
    const data = await adminEventLeagueController.create(req.body);
    res.status(200).send(data);
  },
);

AdminEventLeagueRouter.delete("/:id", async (req, res) => {
  const data = await adminEventLeagueController.delete(+req.params.id);
  res.status(200).send(data);
});

AdminEventLeagueRouter.put(
  "/participants-list/:id",
  validatePayloadMddw(AdminSchemaEventLeagueUsersUpdate),
  async (req, res) => {
    const data =
      await adminEventLeagueController.updateEventLeagueParticipantsList(
        +req.params.id!,
        req.body,
      );
    res.status(200).send(data);
  },
);
