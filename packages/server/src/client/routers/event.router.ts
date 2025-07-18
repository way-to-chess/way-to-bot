import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { ClientEventController } from "@way-to-bot/server/client/controllers/event.controller";
import { getManyOptionsMddw } from "@way-to-bot/server/express/middlewares/get-many-options.mddw";

export const ClientEventRouter = Router();
const clientEventController = DiContainer.get(ClientEventController);

ClientEventRouter.get("/", getManyOptionsMddw, (req, res) =>
  clientEventController.getMany(req, res),
);

ClientEventRouter.get("/:id", (req, res) =>
  clientEventController.getById(req, res),
);
