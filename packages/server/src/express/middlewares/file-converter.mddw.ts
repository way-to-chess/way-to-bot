import { NextFunction, Request, Response } from "express";
import { EFileAssigment } from "@way-to-bot/shared/api/enums/index.js";
import sharp from "sharp";
import path from "path";
import fsAsync from "fs/promises";

export async function fileConverterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.file) {
    return next();
  }

  const mime = req.file.mimetype;

  if (!mime.startsWith("image/")) {
    next();
  }

  try {
    const { width, height, quality } = getFormatOptions(req.body.assigment);

    const originalFilePath = req.file.path;
    const parsed = path.parse(originalFilePath);

    const previewFileName = `${parsed.name}_preview.jpeg`;
    const previewFilePath = path.join(parsed.dir, previewFileName);

    await sharp(originalFilePath)
      .rotate()
      .resize({ width, height })
      .jpeg({ quality })
      .toFile(previewFilePath);

    // @ts-expect-error Ignat
    req.file.previewFilePath = previewFilePath;

    const jpegFilePath = path.join(parsed.dir, `${parsed.name}.jpeg`);
    await sharp(originalFilePath).rotate().jpeg().toFile(jpegFilePath);

    await fsAsync.unlink(originalFilePath);

    req.file.path = jpegFilePath;
    req.file.filename = path.basename(jpegFilePath);

    next();
  } catch (e) {
    return next(e);
  }
}

function getFormatOptions(fileAssigment?: EFileAssigment): {
  width: number;
  height: number;
  quality: number;
} {
  switch (fileAssigment) {
    case EFileAssigment.AVATAR:
      return { width: 200, height: 200, quality: 75 };
    case EFileAssigment.RECEIPT:
      return { width: 800, height: 1100, quality: 85 };
    case EFileAssigment.EVENT:
      return { width: 800, height: 1080, quality: 85 };
    case EFileAssigment.LOCATION:
      return { width: 800, height: 1080, quality: 85 };
    default:
      return { width: 200, height: 200, quality: 70 };
  }
}
