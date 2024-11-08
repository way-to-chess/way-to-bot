import { FileEntity } from "../database/entities/file.entity";
import * as path from "path";
import { rm } from "fs/promises";
import { dbInstance } from "../database/init";
import { IFileDeletePayload } from "../interfaces/file.interface";
import { FileDTO } from "../DTO/file.DTO";
import csvToJson from "convert-csv-to-json";
import { UserEntity } from "../database/entities/user.entity";
import { In } from "typeorm";

export class FileService {
  private fileRepository = dbInstance.getRepository(FileEntity);

  async addFile(file: Express.Multer.File) {
    if (!file.destination || !file.filename) {
      throw new Error("No destination or filename, data corrupted");
    }

    const newFile = new FileEntity();
    newFile.url = path.join(file.destination, file.filename);

    const savedFile = await this.fileRepository.save(newFile);
    if (!savedFile) {
      throw new Error("File was not saved, please try again");
    }

    return new FileDTO(savedFile);
  }

  async deleteFile(payload: IFileDeletePayload) {
    const { fileId } = payload;
    const file = await this.fileRepository.findOneBy({ id: fileId });

    if (!file) {
      throw new Error(`File with id ${fileId} not found}`);
    }

    await this.fileRepository.delete(file.id);
    await rm(file.url, { force: true });
    return true;
  }

  // TODO dont forget about BYE (no opponent)
  async importCsv(file: Express.Multer.File) {
    if (!file.destination || !file.filename) {
      throw new Error("No destination or filename, data corrupted");
    }

    const userRepository = dbInstance.getRepository(UserEntity);

    const csvFilePath = path.join(file.destination, file.filename);

    const results = csvToJson.getJsonFromCsv(csvFilePath) as {
      Round: string;
      Board: string;
      White: string;
      Black: string;
      Result: string;
    }[];

    const participantsData = results.reduce(
      (accumulator, result) => {
        const whiteSplitted = result.White.split(" ");
        const blackSplitted = result.Black.split(" ");
        const firstNames = [whiteSplitted[1].trim(), blackSplitted[1].trim()];
        const lastNames = [whiteSplitted[0].trim(), blackSplitted[0].trim()];

        firstNames.forEach((name) => accumulator.firstNames.add(name));
        lastNames.forEach((name) => accumulator.lastNames.add(name));

        return accumulator;
      },
      { firstNames: new Set<string>(), lastNames: new Set<string>() },
    );

    const users = await userRepository.find({
      where: {
        firstName: In(Array.from(participantsData.firstNames)),
        lastName: In(Array.from(participantsData.lastNames)),
      },
    });

    results.forEach((result) => {
      const whiteSplitted = result.White.split(" ");
      const blackSplitted = result.Black.split(" ");

      const whiteUser = users.find(
        (user) =>
          user.firstName === whiteSplitted[1] &&
          user.lastName === whiteSplitted[0],
      );
      const blackUser = users.find(
        (user) =>
          user.firstName === blackSplitted[1] &&
          user.lastName === blackSplitted[0],
      );

      if (whiteUser && blackUser) {
        switch (result.Result) {
          case "1-0":
            whiteUser.wins++;
            blackUser.losses++;
            break;
          case "0-1":
            whiteUser.losses++;
            blackUser.wins++;
            break;
          case "0.5-0.5":
            whiteUser.draws++;
            blackUser.draws++;
            break;
        }
      }
    });

    await userRepository.save(users);
  }
}
