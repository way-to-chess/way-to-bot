import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { AdminUserController } from "@way-to-bot/server/admin/controllers/user.controller";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw";
import {
  AdminSchemaUserCreate,
  AdminSchemaUserUpdate,
} from "@way-to-bot/shared/api/zod/admin/user.schema";

export const AdminUserRouter = Router();
const adminUserController = DiContainer.get(AdminUserController);

AdminUserRouter.get("/", getManyOptionsMddw, (req, res) =>
  adminUserController.getMany(req, res),
);

AdminUserRouter.get("/:id", (req, res) => adminUserController.getOne(req, res));

AdminUserRouter.post(
  "/",
  validatePayloadMddw(AdminSchemaUserCreate),
  (req, res) => adminUserController.create(req, res),
);

AdminUserRouter.patch(
  "/:id",
  validatePayloadMddw(AdminSchemaUserUpdate),
  (req, res) => adminUserController.update(req, res),
);

AdminUserRouter.delete("/:id", (req, res) =>
  adminUserController.delete(req, res),
);
