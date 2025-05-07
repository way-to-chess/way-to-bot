import { inject, injectable } from "inversify";
import { ParticipateRequestRepository } from "@way-to-bot/server/database/repositories/participate-request.repository.mjs";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity.mjs";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";
import { EventLeagueUserRepository } from "@way-to-bot/server/database/repositories/event-league-user.repository.mjs";
import { EventLeagueRepository } from "@way-to-bot/server/database/repositories/event-league.repository.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import { TAdminParticipateRequestApprovePayload } from "@way-to-bot/shared/api/zod/admin/participate-request.schema.js";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity.mjs";
import { logger } from "@way-to-bot/server/services/logger.service.mjs";

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

      const eventLeague =
        await this._eventLeagueRepository.getOneByEventIdAndLeagueId(
          updatedParticipateRequest.eventId,
          payload.leagueId,
          queryRunner,
        );

      if (!eventLeague) {
        throw new NotFoundError(
          `Event league with eventId: ${updatedParticipateRequest.eventId} and leagueId: ${payload.leagueId} not found`,
        );
      }

      const elu = new EventLeagueUserEntity();
      elu.eventLeagueId = eventLeague.id;
      elu.userId = updatedParticipateRequest.userId;

      await this._eventLeagueUserRepository.addRows([elu], queryRunner);

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

  async getMany(options?: GetManyOptionsDTO<ParticipateRequestEntity>) {
    return this._participateRequestRepository.getMany(options?.getFindOptions);
  }
}
