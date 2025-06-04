import { inject, injectable } from "inversify";
import { EventRepository } from "@way-to-bot/server/database/repositories/event.repository.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";

@injectable()
export class ClientEventService {
  constructor(
    @inject(EventRepository) private readonly _eventRepository: EventRepository,
  ) {}

  async getMany(options?: GetManyOptionsDTO<EventEntity>) {
    return this._eventRepository.getMany(options?.getFindOptions);
  }

  async getById(id: number) {
    const data = await this._eventRepository.getOne({ where: { id } });
    if (!data) {
      throw new NotFoundError(`Event with id ${id} not found`);
    }
    return data;
  }
}
