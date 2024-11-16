import sharp from "sharp";
import fs from "fs/promises";
import path from "node:path";

export async function compressImage(inputPath: string, assignment: string) {
  const inputFileName = path.parse(inputPath).name;
  const inputFileExtension = path.extname(inputPath);
  const outputPath = path.join(
    path.dirname(inputPath),
    "avatars",
    `${inputFileName}${inputFileExtension}`,
  );
  switch (assignment) {
    case "avatar":
      await sharp(inputPath)
        .rotate()
        .resize(200, 200)
        .jpeg({ quality: 80 })
        .toFile(outputPath);
  }

  await fs.unlink(inputPath);

  return outputPath;
}
