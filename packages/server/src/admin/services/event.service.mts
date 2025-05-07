import { inject, injectable } from "inversify";
import { EventRepository } from "@way-to-bot/server/database/repositories/event.repository.mjs";
import { TgBotService } from "@way-to-bot/server/services/tg-bot.service.mjs";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";
import { messageForNewEvent } from "@way-to-bot/server/utils/helpers.mjs";
import {
  TAdminEventCreatePayload,
  TAdminEventUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/event.schema.js";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";

@injectable()
export class AdminEventService {
  constructor(
    @inject(EventRepository) private readonly _eventRepository: EventRepository,
    @inject(TgBotService) private readonly _tgBotService: TgBotService,
  ) {}

  async getMany(options?: GetManyOptionsDTO<EventEntity>) {
    return this._eventRepository.getMany(options?.getFindOptions);
  }

  async getById(id: number) {
    return this._eventRepository.getById(id);
  }

  async create(event: TAdminEventCreatePayload) {
    const createdEvent = await this._eventRepository.create(event);

    if (!createdEvent) {
      throw new InternalError(`Event was not created`);
    }

    const message = messageForNewEvent(createdEvent);
    // TODO: use some queue
    this._tgBotService.sendMessagesToUsersTg(message);

    return createdEvent;
  }

  async update(id: number, event: TAdminEventUpdatePayload) {
    const updatedEvent = await this._eventRepository.update(id, event);

    if (!updatedEvent) {
      throw new InternalError(`Event was not updated`);
    }

    return updatedEvent;
  }

  async delete(id: number) {
    return this._eventRepository.delete(id);
  }
}
