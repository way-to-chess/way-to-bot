import { inject, injectable } from "inversify";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity.mjs";
import { EventLeagueUserRepository } from "@way-to-bot/server/database/repositories/event-league-user.repository.mjs";
import { EventLeagueRepository } from "@way-to-bot/server/database/repositories/event-league.repository.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import _ from "lodash";
import { In } from "typeorm";
import { TAdminEventLeagueUserUpdatePayload } from "@way-to-bot/shared/api/zod/admin/event-league.schema.js";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";

@injectable()
export class AdminEventLeagueUserService {
  constructor(
    @inject(EventLeagueUserRepository)
    private readonly _eventLeagueUserRepository: EventLeagueUserRepository,
    @inject(EventLeagueRepository)
    private readonly _eventLeagueRepository: EventLeagueRepository,
  ) {}

  async updateEventLeagueUsersList(
    id: number,
    payload: TAdminEventLeagueUserUpdatePayload,
  ) {
    const eventLeague = await this._eventLeagueRepository.getOne({
      where: { id },
      relations: {
        participants: true,
      },
    });

    if (!eventLeague) {
      throw new NotFoundError(`EventLeague with id ${id} not found`);
    }

    const existingUserIds = eventLeague.participants.map((elu) => elu.userId);
    const newUserIds = _.difference(payload.userIds, existingUserIds);
    const usersIdsToDelete = _.difference(existingUserIds, payload.userIds);

    if (usersIdsToDelete)
      await this.removeUsers(usersIdsToDelete, eventLeague.id);

    if (newUserIds) await this.addUsers(newUserIds, eventLeague.id);

    const updatedEventLeague = await this._eventLeagueRepository.getOneById(
      eventLeague.id,
    );

    if (!updatedEventLeague) {
      throw new InternalError(
        `Server error. Cannot update event league with id ${eventLeague.id}`,
      );
    }

    return updatedEventLeague;
  }

  private async addUsers(userIds: number[], eventLeagueId: number) {
    const newEventLeagueUsers = userIds.map((i) => {
      const elu = new EventLeagueUserEntity();
      elu.eventLeagueId = eventLeagueId;
      elu.userId = i;
      return elu;
    });

    return this._eventLeagueUserRepository.addRows(newEventLeagueUsers);
  }

  private async removeUsers(userIds: number[], eventLeagueId: number) {
    return this._eventLeagueUserRepository.deleteRows({
      eventLeagueId,
      userId: In(userIds),
    });
  }
}
