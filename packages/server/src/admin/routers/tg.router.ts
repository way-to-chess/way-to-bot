import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminTgController } from "@way-to-bot/server/admin/controllers/tg.controller.mjs";
import { validatePayloadMddw } from "@way-to-bot/server/express/middlewares/validate-payload.mddw.mjs";
import { AdminSchemaTgSendCustomMessage } from "@way-to-bot/shared/api/zod/admin/tg.schema.js";

export const AdminTgRouter = Router();
const adminTgController = DiContainer.get(AdminTgController);

AdminTgRouter.post("/message/event/notify/:id", (req, res) =>
  adminTgController.sendEventNotification(req, res),
);

AdminTgRouter.post(
  "/message/custom",
  validatePayloadMddw(AdminSchemaTgSendCustomMessage),
  (req, res) => adminTgController.sendCustomMessage(req, res),
);
