import sharp from "sharp";
import fs from "fs/promises";
import path from "node:path";
import { EImageAssigment } from "../enums";

export async function compressImage(
  inputPath: string,
  assignment: EImageAssigment,
) {
  const inputFileName = path.parse(inputPath).name;
  const inputFileExtension = path.extname(inputPath);

  const folder =
    assignment === EImageAssigment.AVATAR
      ? "avatars"
      : assignment === EImageAssigment.RECEIPT
        ? "receipts"
        : "";

  const outputPath = path.join(
    path.dirname(inputPath),
    folder,
    `${inputFileName}${inputFileExtension}`,
  );

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  switch (assignment) {
    case EImageAssigment.AVATAR:
      await sharp(inputPath)
        .rotate()
        .resize(200, 200)
        .jpeg({ quality: 80 })
        .toFile(outputPath);
      break;
    case EImageAssigment.RECEIPT:
      await sharp(inputPath).rotate().jpeg({ quality: 80 }).toFile(outputPath);
  }

  await fs.unlink(inputPath);

  return outputPath;
}
