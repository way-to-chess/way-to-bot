import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { ClientEventController } from "@way-to-bot/server/client/controllers/event.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import { CommonSchemaGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";

export const ClientEventRouter = Router();
const clientEventController = DiContainer.get(ClientEventController);

ClientEventRouter.get(
  "/",
  validatePayloadMddw(CommonSchemaGetManyOptions),
  getManyOptionsMddw,
  async (req, res) => {
    const data = await clientEventController.getMany(
      req.getManyOptions as GetManyOptionsDTO<EventEntity>,
    );
    res.status(200).send(data);
  },
);

ClientEventRouter.get("/:id", async (req, res) => {
  const data = await clientEventController.getById(+req.params.id);
  res.status(200).send(data);
});
