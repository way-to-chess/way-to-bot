import { Request, Router } from "express";
import { FileController } from "../controllers/file.controller";
import { uploadMiddleware } from "../middlewares/upload.mddw";
import {
  ICsvFileUploadPayload,
  IFileDeletePayload,
  IFileUploadPayload,
} from "../interfaces/file.interface";

export const FileRouter = Router();
const fileController = new FileController();

FileRouter.post(
  "/upload",
  uploadMiddleware.single("file"),
  async (req: Request<{}, {}, IFileUploadPayload>, res) => {
    const file = req.file;

    if (!file) {
      throw new Error("file not uploaded");
    }

    const data = await fileController.addFile(file, req.body.assigment!);
    res.status(200).json({ data });
  },
);

FileRouter.post(
  "/importCSV",
  uploadMiddleware.single("file"),
  async (req: Request<{}, {}, ICsvFileUploadPayload>, res) => {
    const file = req.file;

    if (!file) {
      throw new Error("file not uploaded");
    }
    const data = await fileController.importCSV(
      file,
      req.body.assigment!,
      req.body.eventId,
      req.body.leagueId,
    );
    res.status(200).json({ data });
  },
);

FileRouter.delete(
  "/delete",
  async (req: Request<{}, {}, IFileDeletePayload>, res) => {
    const data = await fileController.deleteFile(req.body);
    res.status(200).json({ data });
  },
);
