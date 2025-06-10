import { inject, injectable } from "inversify";
import { EventRepository } from "@way-to-bot/server/database/repositories/event.repository.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";

@injectable()
export class ClientEventService {
  constructor(
    @inject(EventRepository) private readonly _eventRepository: EventRepository,
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
}
