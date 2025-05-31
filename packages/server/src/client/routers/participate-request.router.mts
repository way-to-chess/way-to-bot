import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { ClientParticipateRequestController } from "@way-to-bot/server/client/controllers/participate-request.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import {
  ClientSchemaParticipateRequestCreate,
  ClientSchemaParticipateRequestUpdate,
} from "@way-to-bot/shared/api/zod/client/participate-request.schema.js";
import { authMddw } from "@way-to-bot/server/express/middlewares/auth.mddw.mjs";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw.mjs";
import { CommonSchemaGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";

export const ClientParticipateRequestRouter = Router();
const clientParticipateRequestController = DiContainer.get(
  ClientParticipateRequestController,
);

ClientParticipateRequestRouter.get(
  "/",
  authMddw,
  validatePayloadMddw(CommonSchemaGetManyOptions),
  getManyOptionsMddw,
  async (req, res) => {
    const data = await clientParticipateRequestController.getMany(
      req.user!.id,
      req.getManyOptions as GetManyOptionsDTO<ParticipateRequestEntity>,
    );
    res.status(200).send(data);
  },
);

ClientParticipateRequestRouter.get("/:id", async (req, res) => {
  const data = await clientParticipateRequestController.getById(+req.params.id);
  res.status(200).send(data);
});

ClientParticipateRequestRouter.post(
  "/",
  authMddw,
  validatePayloadMddw(ClientSchemaParticipateRequestCreate),
  async (req, res) => {
    const userId = req.user!.id;
    const data = await clientParticipateRequestController.create(
      userId,
      req.body,
    );
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
