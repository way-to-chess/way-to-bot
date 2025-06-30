import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { ILocationEntity } from "@way-to-bot/shared/api/interfaces/entities/location-entity.interface.js";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";
import { IUserEntity } from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface.js";
import { EEventStatus } from "../../enums/EEventStatus";

export abstract class BaseDTOEvent {
  readonly id: number;
  readonly name: string;
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

  protected constructor(event: IEventEntity) {
    this.id = event.id;
    this.name = event.name;
    this.dateTime = event.dateTime.toISOString();
    this.linkToStream = event.linkToStream;
    this.location = event.location;
    this.participantsLimit = event.participantsLimit;
    this.price = event.price;
    this.status = event.status;
    this.preview = event.preview;
    this.description = event.description;
    this.duration = event.duration;
    this.host = event.host;
  }
}
