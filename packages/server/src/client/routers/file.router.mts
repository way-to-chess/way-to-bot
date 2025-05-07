import {Router} from "express";
import {uploadFileMddw} from '@way-to-bot/server/middlewares/upload.mddw.mjs';


export const FileRouter = Router();

FileRouter.post("/upload", uploadFileMddw.single("file"), (req, res) => {

})