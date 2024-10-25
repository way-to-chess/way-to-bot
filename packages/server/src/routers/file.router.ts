import { Request, Router } from "express";
import { FileController } from "../controllers/file.controller";
import { uploadMiddleware } from "packages/server/src/middlewares/upload.mddw";
import { IFileDeletePayload } from "packages/shared/src/interfaces/file.interface";

export const FileRouter = Router();
const fileController = new FileController();

FileRouter.post(
  "/upload",
  uploadMiddleware.single("file"),
  async (req, res) => {
    if (!req.file) {
      throw new Error("file not uploaded");
    }
    const { file } = req.file;
    const data = await fileController.addFile(file);
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
