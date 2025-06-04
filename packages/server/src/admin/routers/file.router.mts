import { Router } from "express";
import { uploadFileMddw } from "@way-to-bot/server/express/middlewares/file-upload.mddw.mjs";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminFileController } from "@way-to-bot/server/admin/controllers/file.controller.mjs";

export const AdminFileRouter = Router();
const adminFileController = DiContainer.get(AdminFileController);

AdminFileRouter.post(
  "/import/csv/:eventLeagueId",
  uploadFileMddw.single("file"),
  (req, res) => adminFileController.importCsv(req, res),
);
