import { EEventStatus } from "@way-to-bot/shared/api/enums/index.js";
import { IEventEntity } from "@way-to-bot/shared/api/interfaces/entities/event-entity.interface.js";
import { ILocationEntity } from "@way-to-bot/shared/api/interfaces/entities/location-entity.interface.js";
import { IFileEntity } from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface.js";

export abstract class BaseDTOEvent {
  readonly id: number;
  readonly name: string;
  readonly dateTime: Date;
  readonly linkToStream?: string | null;
  readonly location?: ILocationEntity | null;
  readonly participantsLimit?: number | null;
  readonly price?: string | null;
  readonly status: EEventStatus;
  readonly preview?: IFileEntity | null;

  protected constructor(event: IEventEntity) {
    this.id = event.id;
    this.name = event.name;
    this.dateTime = event.dateTime;
    this.linkToStream = event.linkToStream;
    this.location = event.location;
    this.participantsLimit = event.participantsLimit;
    this.price = event.price;
    this.status = event.status;
    this.preview = event.preview;
  }
}
