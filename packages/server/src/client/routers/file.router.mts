import { uploadFileMddw } from "@way-to-bot/server/express/middlewares/file-upload.mddw.mjs";
import { Router } from "express";
import { fileConverterMiddleware } from "@way-to-bot/server/express/middlewares/file-converter.mddw.js";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { ClientFileController } from "@way-to-bot/server/client/controllers/file.controller.mjs";

export const ClientFileRouter = Router();
const fileController = DiContainer.get(ClientFileController);

ClientFileRouter.post(
  "/",
  uploadFileMddw.single("file"),
  fileConverterMiddleware,
  async (req, res) => {
    const data = await fileController.create(req.file, req.body.assigment);
    res.status(201).send(data);
  },
);

ClientFileRouter.delete("/:id", async (req, res) => {
  const data = await fileController.delete(+req.params.id);
  res.status(200).send(data);
});
