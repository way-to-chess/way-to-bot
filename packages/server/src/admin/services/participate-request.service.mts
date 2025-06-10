import { inject, injectable } from "inversify";
import { ParticipateRequestRepository } from "@way-to-bot/server/database/repositories/participate-request.repository.mjs";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity.mjs";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";
import { EventLeagueUserRepository } from "@way-to-bot/server/database/repositories/event-league-user.repository.mjs";
import { EventLeagueRepository } from "@way-to-bot/server/database/repositories/event-league.repository.mjs";
import { TAdminParticipateRequestApprovePayload } from "@way-to-bot/shared/api/zod/admin/participate-request.schema.js";
import { logger } from "@way-to-bot/server/services/logger.service.mjs";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository.mjs";
import { In } from "typeorm";
import { DEFAULT_LEAGUE_NAME } from "@way-to-bot/server/utils/constants.mjs";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";

@injectable()
export class AdminParticipateRequestService {
  constructor(
    @inject(ParticipateRequestRepository)
    private readonly _participateRequestRepository: ParticipateRequestRepository,
    @inject(DbService)
    private readonly _dbService: DbService,
    @inject(EventLeagueUserRepository)
    private readonly _eventLeagueUserRepository: EventLeagueUserRepository,
    @inject(EventLeagueRepository)
    private readonly _eventLeagueRepository: EventLeagueRepository,
    @inject(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async approveParticipateRequest(
    id: number,
    payload: TAdminParticipateRequestApprovePayload,
  ) {
    const queryRunner = this._dbService.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedParticipateRequest =
        await this._participateRequestRepository.update(
          id,
          { approved: true },
          queryRunner,
        );

      if (!updatedParticipateRequest) {
        throw new InternalError("Participate request was not approved");
      }

      const elRepo = this._eventLeagueRepository.getRepository(queryRunner);
      const allEventLeaguesForEvent = await elRepo.find({
        relations: { league: true },
        where: { eventId: updatedParticipateRequest.eventId },
      });

      const defaultEventLeague = allEventLeaguesForEvent.find(
        (l) => l.league.name === DEFAULT_LEAGUE_NAME,
      );

      if (!defaultEventLeague) {
        throw new InternalError(
          `Default league for event ${updatedParticipateRequest.eventId} was not found`,
        );
      }

      const additionalUsers = updatedParticipateRequest.additionalUsers;
      const allParticipantsIds: Set<number> = new Set([
        updatedParticipateRequest.userId,
      ]);
      if (additionalUsers.length) {
        for (const user of additionalUsers) {
          const userId = await this._userRepository.findOrCreateByEmail(
            user,
            queryRunner,
          );
          allParticipantsIds.add(userId);
        }
      }

      const eluList: EventLeagueUserEntity[] = [];
      const eventLeagueIds = allEventLeaguesForEvent.map((el) => el.id);

      for (const pid of allParticipantsIds) {
        const existingElu = await this._eventLeagueUserRepository.getOne(
          {
            where: {
              userId: pid,
              eventLeagueId: In(eventLeagueIds),
            },
          },
          queryRunner,
        );

        if (existingElu) continue;

        const elu = new EventLeagueUserEntity();
        elu.eventLeagueId = defaultEventLeague.id;
        elu.userId = pid;
        eluList.push(elu);
      }

      await this._eventLeagueUserRepository.addRows(eluList, queryRunner);

      await queryRunner.commitTransaction();
      return updatedParticipateRequest;
    } catch (e: any) {
      logger.error(
        "Error while approving participate request. Transaction will be rolled back",
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

  async getMany(options?: TCommonGetManyOptions) {
    return this._participateRequestRepository.getMany(options);
  }
}
