import { inject, injectable } from "inversify";
import { FileRepository } from "@way-to-bot/server/database/repositories/file.repository";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error";
import { DbService } from "@way-to-bot/server/services/db.service";
import { logger } from "@way-to-bot/server/services/logger.service";
import { EventLeagueRepository } from "@way-to-bot/server/database/repositories/event-league.repository";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import fs from "fs/promises";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository";
import { In, QueryRunner } from "typeorm";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity";
import { EventLeagueUserRepository } from "@way-to-bot/server/database/repositories/event-league-user.repository";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error";
import { EventLeagueResultRepository } from "@way-to-bot/server/database/repositories/event-league-result.repository";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity";
import { EventLeagueEntity } from "@way-to-bot/server/database/entities/event-league.entity";

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

  async importSS(eventLeagueId: number, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestError("File was not passed");
    }

    const existingEventLeagueResult =
      await this._eventLeagueResultRepository.getOne({
        where: { eventLeagueId },
      });

    if (existingEventLeagueResult?.ratingFileId) {
      throw new BadRequestError(
        "Event league result has been already imported",
      );
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

      const results = await this.parseCSVFile(file.path);

      const isSwissSystemFile = results.some((result) => {
        const hasName = result.Name;
        const hasRating = result["New Rating"];
        const hasRounds = Object.keys(result).some((key) =>
          key.startsWith("Round #"),
        );

        return hasName && hasRating && hasRounds;
      });

      if (!isSwissSystemFile) {
        throw new BadRequestError(
          "Expected Swiss System standings CSV file with rounds information",
        );
      }

      await this.processSSStandingsFile(results, eventLeague, queryRunner);

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
        "Error while importing Swiss System standings file. Transaction will be rolled back",
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

  async importCR(eventLeagueId: number, file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestError("File was not passed");
    }

    const existingEventLeagueResult =
      await this._eventLeagueResultRepository.getOne({
        where: { eventLeagueId },
      });

    if (existingEventLeagueResult?.ratingFileId) {
      throw new BadRequestError(
        "Event league result has been already imported",
      );
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

      const results = await this.parseCSVFile(file.path);

      const isChessResultsFile = results.some((result) => {
        const hasName = result.Имя;
        const hasRating = result["Рейт."];
        const hasRounds = Object.keys(result).some((key) =>
          key.includes("Тур"),
        );

        return hasName && hasRating && hasRounds;
      });

      if (!isChessResultsFile) {
        throw new BadRequestError("Expected Chess Results CSV file");
      }

      await this.processCRStandingsFile(results, eventLeague, queryRunner);

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
        "Error while importing Chess Results file. Transaction will be rolled back",
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

  private async parseCSVFile(filePath: string): Promise<any[]> {
    const content = await fs.readFile(filePath, "utf-8");
    const lines = content.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      throw new BadRequestError("CSV file is empty or has no data rows");
    }

    const headers = lines[0]!.split(";").map((header) => header.trim());

    const results: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]!.split(";");
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || "";
      });

      results.push(row);
    }

    return results;
  }

  private async processSSStandingsFile(
    results: any[],
    eventLeague: EventLeagueEntity,
    queryRunner: QueryRunner,
  ) {
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

    const users = await this._userRepository.getRepository(queryRunner).find({
      where: {
        firstName: In(Array.from(participantsData.firstNames)),
        lastName: In(Array.from(participantsData.lastNames)),
      },
    });
    const usersByFullName = new Map<string, UserEntity>();
    for (const u of users) {
      usersByFullName.set(`${u.lastName} ${u.firstName}`, u);
    }

    const usersToUpdate = new Map<number, UserEntity>();
    const updatedEluMap = new Map<number, EventLeagueUserEntity>();
    const participantByUserId = new Map<number, EventLeagueUserEntity>();
    for (const p of eventLeague.participants) {
      participantByUserId.set(p.userId, p);
    }

    for (const result of results) {
      const nameSplitted = result.Name.split(" ");

      if (nameSplitted.length !== 2) {
        throw new BadRequestError(`Invalid participant name ${result.Name}`);
      }

      const user = usersByFullName.get(`${nameSplitted[0]} ${nameSplitted[1]}`);

      if (!user) {
        continue;
      }

      const eventLeagueUser = participantByUserId.get(user.id);

      if (!eventLeagueUser) {
        throw new BadRequestError(
          `Event league user with user id ${user.id} not found in event league ${eventLeague.id}`,
        );
      }

      if (result["New Rating"]) {
        const newRating = Number(result["New Rating"].trim());

        if (!isNaN(newRating)) {
          if (user.rating) {
            eventLeagueUser.points = newRating - user.rating;
          }
          user.rating = newRating;
          usersToUpdate.set(user.id, user);
        }
      }

      const position = result.Pos ? result.Pos.trim() : null;
      if (position) {
        eventLeagueUser.place = position.includes("-")
          ? Number(position.substring(0, position.indexOf("-")))
          : Number(position);
      }

      this.processSSPlayerRounds(result, user);
      usersToUpdate.set(user.id, user);
      updatedEluMap.set(user.id, eventLeagueUser);
    }

    if (usersToUpdate.size > 0) {
      const userRepo = queryRunner.manager.getRepository(UserEntity);
      await userRepo.save(Array.from(usersToUpdate.values()));
    }

    if (updatedEluMap.size > 0) {
      await this._eventLeagueUserRepository.addRows(
        Array.from(updatedEluMap.values()),
        queryRunner,
      );
    }
  }

  private processSSPlayerRounds(playerResult: any, player: UserEntity) {
    const roundColumns = Object.keys(playerResult).filter(
      (key) =>
        key.startsWith("Round #") &&
        playerResult[key] &&
        playerResult[key].trim() !== "",
    );

    for (const roundCol of roundColumns) {
      const roundResult = playerResult[roundCol];
      const result = roundResult.trim();

      if (result.startsWith("+")) {
        player.wins++;
      } else if (result.startsWith("-")) {
        player.losses++;
      } else if (result.startsWith("=")) {
        player.draws++;
      }
    }
  }

  private async processCRStandingsFile(
    results: any[],
    eventLeague: EventLeagueEntity,
    queryRunner: QueryRunner,
  ) {
    const participantsData = results.reduce(
      (accumulator, result) => {
        const nameSplitted = result.Имя.split(" ");

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

    const users = await this._userRepository.getRepository(queryRunner).find({
      where: {
        firstName: In(Array.from(participantsData.firstNames)),
        lastName: In(Array.from(participantsData.lastNames)),
      },
    });
    const usersByFullName = new Map<string, UserEntity>();
    for (const u of users) {
      usersByFullName.set(`${u.lastName} ${u.firstName}`, u);
    }

    const usersToUpdate = new Map<number, UserEntity>();
    const updatedEluMap = new Map<number, EventLeagueUserEntity>();
    const participantByUserId = new Map<number, EventLeagueUserEntity>();
    for (const p of eventLeague.participants) {
      participantByUserId.set(p.userId, p);
    }

    for (const result of results) {
      const nameSplitted = result.Имя.split(" ");

      if (nameSplitted.length !== 2) {
        throw new BadRequestError(`Invalid participant name ${result.Имя}`);
      }

      const user = usersByFullName.get(`${nameSplitted[0]} ${nameSplitted[1]}`);

      if (!user) {
        continue;
      }

      const eventLeagueUser = participantByUserId.get(user.id);

      if (!eventLeagueUser) {
        throw new BadRequestError(
          `Event league user with user id ${user.id} not found in event league ${eventLeague.id}`,
        );
      }

      if (result["Рейт."]) {
        const newRating = Number(result["Рейт."].trim());

        if (!isNaN(newRating)) {
          if (user.rating) {
            eventLeagueUser.points = newRating - user.rating;
          }
          user.rating = newRating;
          usersToUpdate.set(user.id, user);
        }
      }

      const position = result["Ст.ном"] ? result["Ст.ном"].trim() : null;
      if (position) {
        const place = Number(position);

        if (!isNaN(place)) {
          eventLeagueUser.place = place;
        }
      }

      this.processCRPlayerRounds(result, user);
      usersToUpdate.set(user.id, user);
      updatedEluMap.set(user.id, eventLeagueUser);
    }

    if (usersToUpdate.size > 0) {
      const userRepo = queryRunner.manager.getRepository(UserEntity);
      await userRepo.save(Array.from(usersToUpdate.values()));
    }

    if (updatedEluMap.size > 0) {
      await this._eventLeagueUserRepository.addRows(
        Array.from(updatedEluMap.values()),
        queryRunner,
      );
    }
  }

  private processCRPlayerRounds(playerResult: any, player: UserEntity) {
    const roundColumns = Object.keys(playerResult).filter(
      (key) =>
        key.includes("Тур") &&
        playerResult[key] &&
        playerResult[key].trim() !== "" &&
        playerResult[key].trim() !== "0",
    );

    for (const roundCol of roundColumns) {
      const roundResult = playerResult[roundCol];
      const result = roundResult.trim();

      const match = result.match(/^(\d+)([wb])([01½])$/);

      if (match) {
        const [, , color, gameResult] = match;

        switch (gameResult) {
          case "1":
            player.wins++;
            break;
          case "0":
            player.losses++;
            break;
          case "½":
            player.draws++;
            break;
        }
      }
    }
  }
}
