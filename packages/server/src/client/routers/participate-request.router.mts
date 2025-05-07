import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { ClientParticipateRequestController } from "@way-to-bot/server/client/controllers/participate-request.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/middlewares/validate-payload.mddw.mjs";
import {
  ClientSchemaParticipateRequestCreate,
  ClientSchemaParticipateRequestUpdate,
} from "@way-to-bot/shared/api/zod/client/participate-request.schema.js";

export const ClientParticipateRequestRouter = Router();
const clientParticipateRequestController = DiContainer.get(
  ClientParticipateRequestController,
);

ClientParticipateRequestRouter.get("/:id", async (req, res) => {
  const data = await clientParticipateRequestController.getById(+req.params.id);
  res.status(200).send(data);
});

ClientParticipateRequestRouter.post(
  "/",
  validatePayloadMddw(ClientSchemaParticipateRequestCreate),
  async (req, res) => {
    const data = await clientParticipateRequestController.create(req.body);
    res.status(201).send(data);
  },
);

ClientParticipateRequestRouter.patch(
  "/:id",
  validatePayloadMddw(ClientSchemaParticipateRequestUpdate),
  async (req, res) => {
    const data = await clientParticipateRequestController.update(
      +req.params.id!,
      req.body,
    );
    res.status(200).send(data);
  },
);

ClientParticipateRequestRouter.delete("/:id", async (req, res) => {
  const data = await clientParticipateRequestController.delete(+req.params.id);
  res.status(200).send(data);
});
