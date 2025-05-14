import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { ClientUserController } from "@way-to-bot/server/client/controllers/user.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import { CommonSchemaGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema.js";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw.mjs";
import {
  ClientSchemaUserCreate,
  ClientSchemaUserUpdate,
} from "@way-to-bot/shared/api/zod/client/user.schema.js";
import { authMddw } from "@way-to-bot/server/express/middlewares/auth.mddw.mjs";
import { NoPermissionsError } from "@way-to-bot/server/common/errors/no-permissions.error.mjs";

export const ClientUserRouter = Router();
const clientUserController = DiContainer.get(ClientUserController);

ClientUserRouter.get(
  "/",
  validatePayloadMddw(CommonSchemaGetManyOptions),
  getManyOptionsMddw,
  async (req, res) => {
    const data = await clientUserController.getMany(req.query as any);
    res.status(200).send(data);
  },
);

ClientUserRouter.get("/:id", async (req, res) => {
  const data = await clientUserController.getById(+req.params.id);
  res.status(200).send(data);
});

ClientUserRouter.post(
  "/",
  validatePayloadMddw(ClientSchemaUserCreate),
  async (req, res) => {
    const data = await clientUserController.create(req.body);
    res.status(201).send(data);
  },
);

ClientUserRouter.patch(
  "/:id",
  authMddw,
  validatePayloadMddw(ClientSchemaUserUpdate),
  async (req, res) => {
    if (req.user!.id !== +req.params.id!) {
      throw new NoPermissionsError(`User can use only self edit`);
    }

    const data = await clientUserController.update(+req.params.id!, req.body);
    res.status(200).send(data);
  },
);
