import { inject, injectable } from "inversify";
import { FileRepository } from "@way-to-bot/server/database/repositories/file.repository.mjs";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error.mjs";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { logger } from "@way-to-bot/server/services/logger.service.mjs";
import { EventLeagueRepository } from "@way-to-bot/server/database/repositories/event-league.repository.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import csvToJson from "convert-csv-to-json";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import { In } from "typeorm";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity.mjs";
import { EventLeagueUserRepository } from "@way-to-bot/server/database/repositories/event-league-user.repository.mjs";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";
import { EventLeagueResultRepository } from "@way-to-bot/server/database/repositories/event-league-result.repository.js";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";

@injectable()
export class AdminFileService {
  constructor(
    @inject(FileRepository) private readonly _fileRepository: FileRepository,
    @inject(DbService) private readonly _dbService: DbService,
    @inject(EventLeagueRepository)
    private readonly _eventLeagueRepository: EventLeagueRepository,
    @inject(UserRepository) private readonly _userRepository: UserRepository,
    @inject(EventLeagueUserRepository)
    private readonly _eventLeagueUserRepository: EventLeagueUserRepository,
    @inject(EventLeagueResultRepository)
    private readonly _eventLeagueResultRepository: EventLeagueResultRepository,
  ) {}

  async importRoundsCsv(eventLeagueId: number, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestError("File was not passed");
    }

    const existingResult = await this._eventLeagueResultRepository.getOne({
      where: { eventLeagueId },
    });

    if (existingResult?.roundsFileId)
      throw new BadRequestError("Rounds have been already counted");

    const queryRunner = this._dbService.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const results = csvToJson.getJsonFromCsv(file.path) as {
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

          const firstNames = [
            whiteSplitted[1]!.trim(),
            blackSplitted[1]!.trim(),
          ];
          const lastNames = [
            whiteSplitted[0]!.trim(),
            blackSplitted[0]!.trim(),
          ];

          firstNames.forEach((name) => accumulator.firstNames.add(name));
          lastNames.forEach((name) => accumulator.lastNames.add(name));

          return accumulator;
        },
        { firstNames: new Set<string>(), lastNames: new Set<string>() },
      );

      const { data: users } = await this._userRepository.getMany({
        where: {
          firstName: In(Array.from(participantsData.firstNames)),
          lastName: In(Array.from(participantsData.lastNames)),
        },
      });

      for (const result of results) {
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

        if (!whiteUser) {
          throw new Error(
            "White player not found for such values: " +
              whiteSplitted.join(" "),
          );
        }

        if (!blackUser) {
          throw new Error(
            "Black player not found for such values: " +
              blackSplitted.join(" "),
          );
        }

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

        const userRepo = queryRunner.manager.getRepository(UserEntity);
        await userRepo.save(whiteUser);
        await userRepo.save(blackUser);
      }

      const createdFile = await this._fileRepository.create({ url: file.path });

      if (!createdFile) {
        throw new InternalError("File was not created. Server error");
      }

      const eventLeagueResult = await this._eventLeagueResultRepository.upsert({
        eventLeagueId,
        roundsFileId: createdFile.id,
      });

      if (!eventLeagueResult) {
        throw new InternalError("Event league was not updated. Server error");
      }

      await queryRunner.commitTransaction();
    } catch (e: any) {
      logger.error(
        "Error while importing ROUNDS CSV. Transaction will be rolled back",
        {
          message: e.message,
          stack: e.stack,
        },
      );
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async importRatingCsv(eventLeagueId: number, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestError("File was not passed");
    }

    const queryRunner = this._dbService.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const eventLeague = await this._eventLeagueRepository.getOne(
        {
          where: { id: eventLeagueId },
          relations: {
            participants: true,
          },
        },
        queryRunner,
      );

      if (!eventLeague) {
        throw new NotFoundError(
          `Event league with id ${eventLeagueId} not found`,
        );
      }

      const results = csvToJson.getJsonFromCsv(file.path) as {
        Name: string;
        Rating: string;
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

          const firstName = nameSplitted[1]!.trim();
          const lastName = nameSplitted[0]!.trim();

          accumulator.firstNames.add(firstName);
          accumulator.lastNames.add(lastName);

          return accumulator;
        },
        { firstNames: new Set<string>(), lastNames: new Set<string>() },
      );

      const { data: users } = await this._userRepository.getMany({
        where: {
          firstName: In(Array.from(participantsData.firstNames)),
          lastName: In(Array.from(participantsData.lastNames)),
        },
      });

      const updatedEluList: EventLeagueUserEntity[] = [];

      for (const result of results) {
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
          const userRepo = queryRunner.manager.getRepository(UserEntity);
          await userRepo.save(user);

          const eventLeagueUser = eventLeague.participants.find(
            (elu) => elu.userId === user.id,
          );

          if (eventLeagueUser) {
            const position = result.Position
              ? result.Position.trim()
              : result.Pos
                ? result.Pos.trim()
                : null;

            if (position) {
              eventLeagueUser.place = position.includes("-")
                ? Number(position.substring(0, position.indexOf("-")))
                : Number(position);
            }

            const rating = +result.Rating.trim();
            const newRating = +result.NewRating.trim();

            if (!isNaN(rating) && !isNaN(newRating)) {
              eventLeagueUser.points = newRating - rating;
            }

            updatedEluList.push(eventLeagueUser);
          }
        }
      }

      await this._eventLeagueUserRepository.addRows(
        updatedEluList,
        queryRunner,
      );

      const createdFile = await this._fileRepository.create({ url: file.path });

      if (!createdFile) {
        throw new InternalError("File was not created. Server error");
      }

      const eventLeagueResult = await this._eventLeagueResultRepository.upsert({
        eventLeagueId,
        ratingFileId: createdFile.id,
      });

      if (!eventLeagueResult) {
        throw new InternalError("Event league was not updated. Server error");
      }

      await queryRunner.commitTransaction();
    } catch (e: any) {
      logger.error(
        "Error while importing RATING CSV. Transaction will be rolled back",
        {
          message: e.message,
          stack: e.stack,
        },
      );
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
