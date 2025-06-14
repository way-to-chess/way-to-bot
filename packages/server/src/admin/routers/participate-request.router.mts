import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminParticipateRequestController } from "@way-to-bot/server/admin/controllers/participate-request.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw.mjs";
import { AdminSchemaParticipateRequestUpdate } from "@way-to-bot/shared/api/zod/admin/participate-request.schema.js";

export const AdminParticipateRequestRouter = Router();
const adminParticipateRequestController = DiContainer.get(
  AdminParticipateRequestController,
);

AdminParticipateRequestRouter.get("/", getManyOptionsMddw, (req, res) =>
  adminParticipateRequestController.getMany(req, res),
);

AdminParticipateRequestRouter.patch(
  "/:id",
  validatePayloadMddw(AdminSchemaParticipateRequestUpdate),
  (req, res) => adminParticipateRequestController.update(req, res),
);
