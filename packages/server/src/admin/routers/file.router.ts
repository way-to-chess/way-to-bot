import { Router } from "express";
import { uploadFileMddw } from "@way-to-bot/server/express/middlewares/file-upload.mddw";
import { DiContainer } from "@way-to-bot/server/services/DI.service";
import { AdminFileController } from "@way-to-bot/server/admin/controllers/file.controller";

export const AdminFileRouter = Router();
const adminFileController = DiContainer.get(AdminFileController);

AdminFileRouter.post(
  "/import/csv/:eventLeagueId",
  uploadFileMddw.single("file"),
  (req, res) => adminFileController.importCsv(req, res),
);
