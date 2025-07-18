import { inject, injectable } from "inversify";
import { EventLeagueRepository } from "@way-to-bot/server/database/repositories/event-league.repository";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error";
import {
  TAdminEventLeagueCreatePayload,
  TAdminEventLeagueUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/event-league.schema";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { DEFAULT_LEAGUE_NAME } from "@way-to-bot/server/utils/constants";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error";
import { AdminEventLeagueUserService } from "@way-to-bot/server/admin/services/event-league-user.service";

@injectable()
export class AdminEventLeagueService {
  constructor(
    @inject(EventLeagueRepository)
    private readonly _eventLeagueRepository: EventLeagueRepository,
    @inject(AdminEventLeagueUserService)
    private readonly _eventLeagueUserService: AdminEventLeagueUserService,
  ) {}

  async create(payload: TAdminEventLeagueCreatePayload) {
    const createdEventLeague =
      await this._eventLeagueRepository.create(payload);
    if (!createdEventLeague) {
      throw new InternalError(`Event League was not created`);
    }
    return createdEventLeague;
  }

  async update(id: number, payload: TAdminEventLeagueUpdatePayload) {
    const updatedEventLeague = await this._eventLeagueRepository.update(
      id,
      payload,
    );

    if (!updatedEventLeague) {
      throw new InternalError(`Event League was not updated`);
    }

    return updatedEventLeague;
  }

  async delete(id: number) {
    const eventLeague = await this._eventLeagueRepository.getOne({
      where: { id },
      relations: {
        participants: true,
        league: true,
      },
    });

    if (!eventLeague) {
      throw new NotFoundError(`Event league with id ${id} not found`);
    }

    if (eventLeague.league.name === DEFAULT_LEAGUE_NAME) {
      throw new BadRequestError(`Cannot delete DEFAULT league`);
    }

    if (eventLeague.participants.length) {
      const defaultEventLeague = await this._eventLeagueRepository.getOne({
        where: { id: eventLeague.eventId },
      });

      if (!defaultEventLeague) {
        throw new InternalError(`Default event league was not found`);
      }

      await this._eventLeagueUserService.updateEventLeagueUsersList(
        defaultEventLeague.id,
        {
          userIds: [
            ...defaultEventLeague.participants.map((p) => p.userId),
            ...eventLeague.participants.map((p) => p.userId),
          ],
        },
      );
    }

    return this._eventLeagueRepository.delete(id);
  }
}
