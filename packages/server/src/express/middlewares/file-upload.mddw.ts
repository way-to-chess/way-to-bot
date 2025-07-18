import { PATH_TO_UPLOADS } from "@way-to-bot/server/utils/constants";
import multer from "multer";
import { access, mkdir } from "fs/promises";
import path from "path";

import { EFileAssigment } from "@way-to-bot/shared/api/enums/EFileAssigment";

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const dirDependsOnAssigment = getDirectoryByFileAssigment(
      req.body.assigment,
    );
    const uploadFolder = path.join(
      PATH_TO_UPLOADS,
      dirDependsOnAssigment,
      uniqueSuffix,
    );
    if (!uploadFolder) {
      cb(new Error("Cannot get upload folder path"), "");
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
    const ext = path.extname(file.originalname);
    cb(null, `file${ext}`);
  },
});

function getDirectoryByFileAssigment(fileAssigment?: EFileAssigment) {
  switch (fileAssigment) {
    case EFileAssigment.AVATAR:
      return "avatars";
    case EFileAssigment.RECEIPT:
      return "receipts";
    case EFileAssigment.LOCATION:
      return "locations";
    case EFileAssigment.EVENT:
      return "events";
    case EFileAssigment.RATING_CSV:
    case EFileAssigment.ROUNDS_CSV:
      return "results";
    default:
      return "others";
  }
}

export const uploadFileMddw = multer({ storage });
