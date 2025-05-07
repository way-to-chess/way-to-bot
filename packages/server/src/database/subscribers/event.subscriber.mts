import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { LeagueEntity } from "@way-to-bot/server/database/entities/league.entity.mjs";
import { EventLeagueEntity } from "@way-to-bot/server/database/entities/event-league.entity.mjs";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";
import { DEFAULT_LEAGUE_NAME } from "@way-to-bot/server/utils/constants.mjs";

@EventSubscriber()
export class EventEntitySubscriber
  implements EntitySubscriberInterface<EventEntity>
{
  listenTo() {
    return EventEntity;
  }

  async afterInsert(event: InsertEvent<EventEntity>) {
    const leagueRepo = event.manager.getRepository(LeagueEntity);
    const eventLeagueRepo = event.manager.getRepository(EventLeagueEntity);

    const defaultLeague = await leagueRepo.findOne({
      where: { name: DEFAULT_LEAGUE_NAME },
    });

    if (!defaultLeague) {
      throw new InternalError("DEFAULT league not found");
    }

    const eventLeague = eventLeagueRepo.create({
      eventId: event.entity.id,
      leagueId: defaultLeague.id,
    });

    await eventLeagueRepo.save(eventLeague);
  }
}
