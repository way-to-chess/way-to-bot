import { FileEntity } from "../database/entities/file.entity";
import * as path from "path";
import { rm } from "fs/promises";
import { dbInstance } from "../database/init";
import {
  ICsvFileUploadPayload,
  IFileDeletePayload,
  IFileUploadPayload,
} from "../interfaces/file.interface";
import { FileDTO } from "../DTO/file.DTO";
import csvToJson from "convert-csv-to-json";
import { UserEntity } from "../database/entities/user.entity";
import { EntityManager, In } from "typeorm";
import { compressImage } from "../utils/format-images";
import { EImageAssigment } from "../enums";
import { EventUserLeagueEntity } from "../database/entities/events_users_leagues";

export class FileService {
  private fileRepository = dbInstance.getRepository(FileEntity);

  async addFile(file: Express.Multer.File, payload: IFileUploadPayload) {
    if (!file.destination || !file.filename) {
      throw new Error("No destination or filename, data corrupted");
    }

    const uploadedFileUrl = path.join(file.destination, file.filename);
    const savingFileUrl =
      payload?.assigment === EImageAssigment.AVATAR
        ? await compressImage(uploadedFileUrl, EImageAssigment.AVATAR)
        : uploadedFileUrl;

    const newFile = new FileEntity();
    newFile.url = savingFileUrl;

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

        if (whiteSplitted.length !== 2 || blackSplitted.length !== 2) {
          return accumulator;
        }

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

      if (whiteSplitted.length !== 2 || blackSplitted.length !== 2) {
        return;
      }

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
    return true;
  }

  async importCsvRating(
    file: Express.Multer.File,
    payload: ICsvFileUploadPayload,
    transactionManager: EntityManager,
  ) {
    if (!file.destination || !file.filename) {
      throw new Error("No destination or filename, data corrupted");
    }

    const { leagueId, eventId } = payload;
    if (!leagueId || !eventId) {
      throw new Error("leagueId and eventId must be provided");
    }

    const userRepository = dbInstance.getRepository(UserEntity);
    const eulRepository = dbInstance.getRepository(EventUserLeagueEntity);

    const csvFilePath = path.join(file.destination, file.filename);

    const results = csvToJson.getJsonFromCsv(csvFilePath) as {
      Name: string;
      NewRating: string;
      Position?: string;
      Pos?: string;
    }[];

    const participantsData = results.reduce(
      (accumulator, result) => {
        const nameSplitted = result.Name.split(" ");

        if (nameSplitted.length !== 2) {
          return accumulator;
        }

        const firstName = nameSplitted[1].trim();
        const lastName = nameSplitted[0].trim();

        accumulator.firstNames.add(firstName);
        accumulator.lastNames.add(lastName);

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

    const euls = await eulRepository.find({
      where: {
        event: { id: eventId },
        league: { id: leagueId },
      },
      relations: {
        user: true,
        event: true,
        league: true,
      },
    });

    results.forEach((result) => {
      const nameSplitted = result.Name.split(" ");

      if (nameSplitted.length !== 2) {
        return;
      }

      const user = users.find(
        (u) =>
          u.firstName === nameSplitted[1] && u.lastName === nameSplitted[0],
      );

      if (user) {
        user.rating = Number(result.NewRating);
        const eventUserLeague = euls.find((eul) => eul.user.id === user.id);

        if (eventUserLeague) {
          const position = result.Position
            ? result.Position.trim()
            : result.Pos
              ? result.Pos.trim()
              : null;

          if (position) {
            eventUserLeague.place = position.includes("-")
              ? Number(position.substring(0, position.indexOf("-")))
              : Number(position);
          }
        }
      }
    });

    await transactionManager.save(users);
    await transactionManager.save(euls);

    return true;
  }
}
