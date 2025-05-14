import { Router } from "express";
import { uploadFileMddw } from "@way-to-bot/server/express/middlewares/file-upload.mddw.mjs";
import { DiContainer } from "@way-to-bot/server/services/DI.service.mjs";
import { AdminFileController } from "@way-to-bot/server/admin/controllers/file.controller.mjs";

export const AdminFileRouter = Router();
const adminFileController = DiContainer.get(AdminFileController);

AdminFileRouter.post(
  "/import/csv/:eventLeagueId",
  uploadFileMddw.single("file"),
  async (req, res) => {
    const data = await adminFileController.importCsv(
      +req.params.eventLeagueId!,
      req.body.assigment,
      req.file,
    );
    res.status(200).send(data);
  },
);
