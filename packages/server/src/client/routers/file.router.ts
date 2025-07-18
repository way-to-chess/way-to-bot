import { uploadFileMddw } from "@way-to-bot/server/express/middlewares/file-upload.mddw";
import { Router } from "express";
import { fileConverterMiddleware } from "@way-to-bot/server/express/middlewares/file-converter.mddw";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { ClientFileController } from "@way-to-bot/server/client/controllers/file.controller";

export const ClientFileRouter = Router();
const fileController = DiContainer.get(ClientFileController);

ClientFileRouter.post(
  "/",
  uploadFileMddw.single("file"),
  fileConverterMiddleware,
  (req, res) => fileController.create(req, res),
);

ClientFileRouter.delete("/:id", (req, res) => fileController.delete(req, res));
