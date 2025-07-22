import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { ClientUserController } from "@way-to-bot/server/client/controllers/user.controller";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw";
import {
  ClientSchemaUserCreate,
  ClientSchemaUserUpdate,
} from "@way-to-bot/shared/api/zod/client/user.schema";
import { authMddw } from "@way-to-bot/server/express/middlewares/auth.mddw";

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
