import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { AdminLocationController } from "@way-to-bot/server/admin/controllers/location.controller";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw";
import {
  AdminSchemaLocationCreate,
  AdminSchemaLocationUpdate,
} from "@way-to-bot/shared/api/zod/admin/location.schema";

export const AdminLocationRouter = Router();
const adminLocationController = DiContainer.get(AdminLocationController);

AdminLocationRouter.get("/", getManyOptionsMddw, (req, res) =>
  adminLocationController.getMany(req, res),
);

AdminLocationRouter.get("/:id", (req, res) =>
  adminLocationController.getOne(req, res),
);

AdminLocationRouter.post(
  "/",
  validatePayloadMddw(AdminSchemaLocationCreate),
  (req, res) => adminLocationController.create(req, res),
);

AdminLocationRouter.patch(
  "/:id",
  validatePayloadMddw(AdminSchemaLocationUpdate),
  (req, res) => adminLocationController.update(req, res),
);

AdminLocationRouter.delete("/:id", (req, res) =>
  adminLocationController.delete(req, res),
);
