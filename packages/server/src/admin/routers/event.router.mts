import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminEventController } from "@way-to-bot/server/admin/controllers/event.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import { CommonSchemaGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw.mjs";
import {
  AdminSchemaEventCreate,
  AdminSchemaEventUpdate,
} from "@way-to-bot/shared/api/zod/admin/event.schema.js";

export const AdminEventRouter = Router();

const adminEventController = DiContainer.get(AdminEventController);

AdminEventRouter.get(
  "/",
  validatePayloadMddw(CommonSchemaGetManyOptions, "query"),
  getManyOptionsMddw,
  async (req, res) => {
    const data = await adminEventController.getMany(
      req.query as unknown as GetManyOptionsDTO<EventEntity>,
    );
    res.status(200).json(data);
  },
);

AdminEventRouter.get("/:id", async (req, res) => {
  const data = await adminEventController.getById(+req.params.id);
  res.status(200).json(data);
});

AdminEventRouter.post(
  "/",
  validatePayloadMddw(AdminSchemaEventCreate),
  async (req, res) => {
    const data = await adminEventController.create(req.body);
    res.status(201).send(data);
  },
);

AdminEventRouter.patch(
  "/:id",
  validatePayloadMddw(AdminSchemaEventUpdate),
  async (req, res) => {
    const data = await adminEventController.update(+req.params.id!, req.body);
    res.status(200).send(data);
  },
);

AdminEventRouter.delete("/:id", async (req, res) => {
  const data = await adminEventController.delete(+req.params.id);
  res.status(200).send(data);
});
