import { Router } from "express";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { CommonAuthController } from "@way-to-bot/server/express/controllers/auth.controller";

export const AuthRouter = Router();
const commonAuthController = DiContainer.get(CommonAuthController);

AuthRouter.post("/tg", async (req, res) => {
  const data = await commonAuthController.tg(req.body);
  res.status(200).send(data);
});
