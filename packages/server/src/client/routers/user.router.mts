import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { ClientUserController } from "@way-to-bot/server/client/controllers/user.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw.mjs";
import {
  ClientSchemaUserCreate,
  ClientSchemaUserUpdate,
} from "@way-to-bot/shared/api/zod/client/user.schema.js";
import { authMddw } from "@way-to-bot/server/express/middlewares/auth.mddw.mjs";

export const ClientUserRouter = Router();
const clientUserController = DiContainer.get(ClientUserController);

ClientUserRouter.get("/", getManyOptionsMddw, (req, res) =>
  clientUserController.getMany(req, res),
);

ClientUserRouter.get("/:id", (req, res) =>
  clientUserController.getById(req, res),
);

ClientUserRouter.post(
  "/",
  validatePayloadMddw(ClientSchemaUserCreate),
  (req, res) => clientUserController.create(req, res),
);

ClientUserRouter.patch(
  "/:id",
  authMddw,
  validatePayloadMddw(ClientSchemaUserUpdate),
  (req, res) => clientUserController.update(req, res),
);
