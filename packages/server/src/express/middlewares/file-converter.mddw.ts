import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import path from "path";
import fsAsync from "fs/promises";
import { EFileAssigment } from "@way-to-bot/shared/api/enums/EFileAssigment";

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
    return next();
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

    const metadata = await sharp(originalFilePath).metadata();
    const outputFileName = `s_${parsed.name}.jpeg`;
    const outputFilePath = path.join(parsed.dir, outputFileName);

    if (metadata.format === "jpeg" || metadata.format === "jpg") {
      await sharp(originalFilePath).rotate().toFile(outputFilePath);
    } else {
      await sharp(originalFilePath).rotate().jpeg().toFile(outputFilePath);
    }

    await fsAsync.unlink(originalFilePath);

    req.file.path = outputFilePath;
    req.file.filename = path.basename(outputFilePath);

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
