import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { ILocationEntity } from "@way-to-bot/shared/api/interfaces/entities/location-entity.interface.js";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { EEventStatus } from "../../enums/EEventStatus";
import { IEventLeagueEntity } from "../../interfaces/entities/event-league-entity.interface";
import { EEventType } from "../../enums/EEventType";

export abstract class BaseDTOEvent {
  readonly id: number;
  readonly name: string;
  readonly type: EEventType;
  readonly city?: string | null;
  readonly dateTime: string;
  readonly linkToStream?: string | null;
  readonly location?: ILocationEntity | null;
  readonly participantsLimit?: number | null;
  readonly price?: string | null;
  readonly status: EEventStatus;
  readonly preview?: IFileEntity | null;
  readonly description?: string | null;
  readonly duration?: number | null;
  readonly host: IUserEntity;
  readonly additionalInfo?: Record<string, unknown> | null;
  readonly eventLeagues: {
    id: number
    name: string;
    link?: string | null;
    participants: IUserEntity[] & { points?: number; place?: number };
  }[];
  readonly participantsCount: number;

  
  protected constructor(event: IEventEntity) {
    this.id = event.id;
    this.name = event.name;
    this.type = event.type;
    this.dateTime = event.dateTime.toISOString();
    this.linkToStream = event.linkToStream;
    this.city = event.city;
    this.location = event.location;
    this.participantsLimit = event.participantsLimit;
    this.price = event.price;
    this.status = event.status;
    this.preview = event.preview;
    this.description = event.description;
    this.duration = event.duration;
    this.host = event.host;
    this.additionalInfo = event.additionalInfo;
    this.eventLeagues = this.mapEventLeagues(event.eventLeagues ?? []);
    this.participantsCount = this.countParticipants(event.eventLeagues ?? []);

  }

  private mapEventLeagues(eventLeagues: IEventLeagueEntity[]) {
    return eventLeagues.map((el) => {
      return {
        id: el.id,
        name: el.league.name,
        link: el.link,
        participants:
          el.participants?.map((elu) => {
            return {
              ...elu.user,
              points: elu.points,
              place: elu.place,
            };
          }) || [],
      };
    });
  }

  countParticipants(eventLeagues: IEventLeagueEntity[]) {
    const uniqueUserIds = new Set<number>();
    
    eventLeagues.forEach(eventLeague => {
      if (eventLeague.participants?.length) {
        eventLeague.participants.forEach(participant => {
          uniqueUserIds.add(participant.userId);
        });
      }
    });
    
    return uniqueUserIds.size;
  }
}
