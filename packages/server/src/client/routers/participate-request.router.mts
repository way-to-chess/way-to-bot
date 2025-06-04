import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { ClientParticipateRequestController } from "@way-to-bot/server/client/controllers/participate-request.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import {
  ClientSchemaParticipateRequestCreate,
  ClientSchemaParticipateRequestUpdate,
} from "@way-to-bot/shared/api/zod/client/participate-request.schema.js";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw.mjs";

export const ClientParticipateRequestRouter = Router();
const clientParticipateRequestController = DiContainer.get(
  ClientParticipateRequestController,
);

ClientParticipateRequestRouter.get("/", getManyOptionsMddw, (req, res) =>
  clientParticipateRequestController.getMany(req, res),
);

ClientParticipateRequestRouter.get("/:id", (req, res) =>
  clientParticipateRequestController.getById(req, res),
);

ClientParticipateRequestRouter.post(
  "/",
  validatePayloadMddw(ClientSchemaParticipateRequestCreate),
  async (req, res) => clientParticipateRequestController.create(req, res),
);

ClientParticipateRequestRouter.patch(
  "/:id",
  validatePayloadMddw(ClientSchemaParticipateRequestUpdate),
  (req, res) => clientParticipateRequestController.update(req, res),
);

ClientParticipateRequestRouter.delete("/:id", (req, res) =>
  clientParticipateRequestController.delete(req, res),
);
