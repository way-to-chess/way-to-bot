import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminLocationController } from "@way-to-bot/server/admin/controllers/location.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/middlewares/validate-payload.mddw.mjs";
import { CommonSchemaGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { getManyOptionsMddw } from "@way-to-bot/server/middlewares/get-many-options.mddw.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { LocationEntity } from "@way-to-bot/server/database/entities/location.entity.mjs";
import {
  AdminSchemaLocationCreate,
  AdminSchemaLocationUpdate,
} from "@way-to-bot/shared/api/zod/admin/location.schema.js";

export const AdminLocationRouter = Router();
const adminLocationController = DiContainer.get(AdminLocationController);

AdminLocationRouter.get(
  "/",
  validatePayloadMddw(CommonSchemaGetManyOptions),
  getManyOptionsMddw,
  async (req, res) => {
    const data = await adminLocationController.getMany(
      req.query as unknown as GetManyOptionsDTO<LocationEntity>,
    );
    res.status(200).send(data);
  },
);

AdminLocationRouter.get("/:id", async (req, res) => {
  const data = await adminLocationController.getOne(+req.params.id);
  res.status(200).send(data);
});

AdminLocationRouter.post(
  "/",
  validatePayloadMddw(AdminSchemaLocationCreate),
  async (req, res) => {
    const data = await adminLocationController.create(req.body);
    res.status(201).send(data);
  },
);

AdminLocationRouter.patch(
  "/:id",
  validatePayloadMddw(AdminSchemaLocationUpdate),
  async (req, res) => {
    const data = await adminLocationController.update(
      +req.params.id!,
      req.body,
    );
    res.status(200).send(data);
  },
);

AdminLocationRouter.delete("/:id", async (req, res) => {
  const data = await adminLocationController.delete(+req.params.id);
  res.status(200).send(data);
});
