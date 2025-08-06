import { inject, injectable } from "inversify";
import { EventRepository } from "@way-to-bot/server/database/repositories/event.repository";
import { TgBotService } from "@way-to-bot/server/services/tg_bot/index";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error";
import { botMessageNewEvent } from "@way-to-bot/server/services/tg_bot/messages";
import {
  TAdminEventCreatePayload,
  TAdminEventUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/event.schema";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository";
import { IsNull, Not } from "typeorm";

@injectable()
export class AdminEventService {
  constructor(
    @inject(EventRepository) private readonly _eventRepository: EventRepository,
    @inject(TgBotService) private readonly _tgBotService: TgBotService,
    @inject(UserRepository) private readonly _userRepository: UserRepository,
  ) {}

  async getMany(options?: TCommonGetManyOptions) {
    return this._eventRepository.getMany(options);
  }

  async getById(id: number) {
    const data = await this._eventRepository.getOne({ where: { id } });
    if (!data) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }
    return data;
  }

  async create(event: TAdminEventCreatePayload) {
    const createdEvent = await this._eventRepository.create(event);

    if (!createdEvent) {
      throw new InternalError(`Event was not created`);
    }

    if (event.notify) {
      const userRepo = this._userRepository.getRepository();
      const users = await userRepo.find({
        where: {
          tgId: Not(IsNull()),
        },
      });

      const { message, options } = botMessageNewEvent(createdEvent);

      // TODO: use some queue
      setImmediate(async () => {
        this._tgBotService.sendMessagesToUsers(users, message, options);
      });
    }

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
