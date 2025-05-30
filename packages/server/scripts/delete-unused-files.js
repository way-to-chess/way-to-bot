import "dotenv/config.js";
import path from "path";
import { DbService } from "./services/db.service.js";
import { FileService } from "./services/file.service.js";
import { fileURLToPath } from "node:url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);

async function main() {
  const dbService = new DbService();

  try {
    // init stage
    await dbService.connect();
    const fileService = new FileService(dbService);

    const filesFromFs = await fileService.getAllFilesFromFs();
    const usingFiles = await fileService.getAllFilesFromDb(true);
    const nonUsingFiles = await fileService.getAllFilesFromDb(false);

    const corruptedFiles = [...usingFiles, ...nonUsingFiles]
      .filter((f) => !filesFromFs.includes(f.url))
      .map((f) => f.id);

    if (process.argv[2]) {
      return `
FILES COUNT IN FS: ${filesFromFs.length}
FILES COUNT USING: ${usingFiles.length}
FILES COUNT NON-USING: ${nonUsingFiles.length}
FILES COUNT CORRUPTED: ${corruptedFiles}
      `;
    }

    // delete unused files in db
    const deletedNonUsingFilesCount = nonUsingFiles.length
      ? await fileService.deleteFilesFromDb(nonUsingFiles.map((f) => f.id))
      : 0;

    // delete files non-existing in db from fs
    const deletedFilesFromFs = await deleteFilesFromFs(
      dbService,
      fileService,
      filesFromFs,
      usingFiles.map((f) => f.url),
    );
    return `Non using files deleted: ${deletedNonUsingFilesCount}
    Corrupted files: ${corruptedFiles}
    Deleted files from fs: ${deletedFilesFromFs.reduce(
      (pr, cur) => {
        if (cur.status === "fulfilled") {
          pr[0]++;
          return pr;
        } else {
          pr[1]++;
          return pr;
        }
      },
      [0, 0],
    )}
    `;
  } catch (e) {
    throw e;
  } finally {
    await dbService.destroy().catch((e) => `Cannot destroy DB pool: ${e}`);
  }
}

main()
  .then((res) => {
    console.log(`\x1b[33m${path.basename(__filename)}: \x1b[32m${res}`);
  })
  .catch((e) => {
    console.error(`\x1b[33m$${path.basename(__filename)}:`, `\x1b[31m${e}`);
  });

/**
 *
 * @param {import("./services/db.service.js").DbService} dbService
 * @param {import("./services/file.service.js").FileService} fileService
 * @param {string[]} filesFromFs
 * @param {string[]} usingFiles
 * @returns {Promise<number>}
 */
async function deleteFilesFromFs(
  dbService,
  fileService,
  filesFromFs,
  usingFiles,
) {
  const filesDeletePromiseList = filesFromFs
    .filter((f) => !usingFiles.includes(f))
    .map(
      (f) =>
        new Promise((resolve, reject) => {
          fs.rm(path.join(FileService.PATH_TO_UPLOADS, f))
            .then(() => resolve())
            .catch((e) => reject(e));
        }),
    );

  return Promise.allSettled(filesDeletePromiseList);
}
