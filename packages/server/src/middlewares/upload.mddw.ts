import multer from "multer";
import { mkdir, access } from "node:fs/promises";

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uploadFolder = process.env.UPLOAD_FOLDER;
    if (!uploadFolder) {
      cb(new Error("Cannot get upload folder path"));
    }
    access(uploadFolder)
      .then(() => {
        cb(null, uploadFolder);
      })
      .catch(async () => {
        await mkdir(uploadFolder, { recursive: true });
        cb(null, uploadFolder);
      });
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "_" + file.originalname);
  },
});

export const uploadMiddleware = multer({ storage });
