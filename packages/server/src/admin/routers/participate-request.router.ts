import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { AdminParticipateRequestController } from "@way-to-bot/server/admin/controllers/participate-request.controller";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw";
import { AdminSchemaParticipateRequestUpdate } from "@way-to-bot/shared/api/zod/admin/participate-request.schema";

export const AdminParticipateRequestRouter = Router();
const adminParticipateRequestController = DiContainer.get(
  AdminParticipateRequestController,
);

AdminParticipateRequestRouter.get("/", getManyOptionsMddw, (req, res) =>
  adminParticipateRequestController.getMany(req, res),
);

AdminParticipateRequestRouter.get("/:id", (req, res) =>
  adminParticipateRequestController.getById(req, res),
);

AdminParticipateRequestRouter.patch(
  "/:id",
  validatePayloadMddw(AdminSchemaParticipateRequestUpdate),
  (req, res) => adminParticipateRequestController.update(req, res),
);
