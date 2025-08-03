import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { ClientParticipateRequestController } from "@way-to-bot/server/client/controllers/participate-request.controller";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw";
import { ClientSchemaParticipateRequestCreate } from "@way-to-bot/shared/api/zod/client/participate-request.schema";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw";
import { authMddw } from "@way-to-bot/server/express/middlewares/auth.mddw";

export const ClientParticipateRequestRouter = Router();
const clientParticipateRequestController = DiContainer.get(
  ClientParticipateRequestController,
);

ClientParticipateRequestRouter.get("/", authMddw, getManyOptionsMddw, (req, res) =>
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

ClientParticipateRequestRouter.delete("/:id", (req, res) =>
  clientParticipateRequestController.delete(req, res),
);
