import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminUserController } from "@way-to-bot/server/admin/controllers/user.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import { CommonSchemaGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";
import {
  AdminSchemaUserCreate,
  AdminSchemaUserUpdate,
} from "@way-to-bot/shared/api/zod/admin/user.schema.js";

export const AdminUserRouter = Router();
const adminUserController = DiContainer.get(AdminUserController);

AdminUserRouter.get(
  "/",
  validatePayloadMddw(CommonSchemaGetManyOptions),
  getManyOptionsMddw,
  async (req, res) => {
    const data = await adminUserController.getMany(
      req.query as unknown as GetManyOptionsDTO<UserEntity>,
    );
    res.status(200).send(data);
  },
);

AdminUserRouter.get("/:id", async (req, res) => {
  const data = await adminUserController.getOne(+req.params.id);
  res.status(200).send(data);
});

AdminUserRouter.post(
  "/",
  validatePayloadMddw(AdminSchemaUserCreate),
  async (req, res) => {
    const data = await adminUserController.create(req.body);
    res.status(201).send(data);
  },
);

AdminUserRouter.patch(
  "/:id",
  validatePayloadMddw(AdminSchemaUserUpdate),
  async (req, res) => {
    const data = await adminUserController.update(+req.params.id!, req.body);
    res.status(200).send(data);
  },
);

AdminUserRouter.delete("/:id", async (req, res) => {
  const data = await adminUserController.delete(+req.params.id);
  res.status(200).send(data);
});
