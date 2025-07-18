import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { AdminEventController } from "@way-to-bot/server/admin/controllers/event.controller";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw";
import {
  AdminSchemaEventCreate,
  AdminSchemaEventUpdate,
} from "@way-to-bot/shared/api/zod/admin/event.schema";

export const AdminEventRouter = Router();

const adminEventController = DiContainer.get(AdminEventController);

AdminEventRouter.get("/", getManyOptionsMddw, (req, res) =>
  adminEventController.getMany(req, res),
);

AdminEventRouter.get("/:id", (req, res) =>
  adminEventController.getById(req, res),
);

AdminEventRouter.post(
  "/",
  validatePayloadMddw(AdminSchemaEventCreate),
  (req, res) => adminEventController.create(req, res),
);

AdminEventRouter.patch(
  "/:id",
  validatePayloadMddw(AdminSchemaEventUpdate),
  (req, res) => adminEventController.update(req, res),
);

AdminEventRouter.delete("/:id", (req, res) =>
  adminEventController.delete(req, res),
);
