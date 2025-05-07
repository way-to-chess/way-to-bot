import { inject, injectable } from "inversify";
import { EventRepository } from "@way-to-bot/server/database/repositories/event.repository.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";

@injectable()
export class ClientEventService {
  constructor(
    @inject(EventRepository) private readonly _eventRepository: EventRepository,
  ) {}

  async getMany(options?: GetManyOptionsDTO<EventEntity>) {
    return this._eventRepository.getMany(options?.getFindOptions);
  }

  getById(id: number) {
    return this._eventRepository.getById(id);
  }
}
