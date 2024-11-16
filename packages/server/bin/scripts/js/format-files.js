// eslint-disable-next-line @typescript-eslint/no-require-imports
const sharp = require("sharp");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs/promises");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

async function compressImage() {
  const files = await fs.readdir(process.env.UPLOAD_FOLDER);
  console.log(process.env.UPLOAD_FOLDER);
  if (files.length) {
    for (const fileName of files) {
      if (fileName.endsWith("_image.jpg")) {
        const file = path.join(process.env.UPLOAD_FOLDER, fileName);
        const stat = await fs.stat(file);
        if (stat.isFile() && stat.size >= 1 * 1024 * 1024) {
          const outputPath = path.join(
            process.env.UPLOAD_FOLDER,
            "avatars",
            path.parse(fileName).name + ".jpeg",
          );

          await fs.mkdir(path.join(process.env.UPLOAD_FOLDER, "avatars"), {
            recursive: true,
          });

          await sharp(file)
            .rotate()
            .resize(200, 200)
            .jpeg({ quality: 80 })
            .toFile(outputPath);
        }
      }
    }
  }
}

compressImage().then(() => console.log("files compressed"));
