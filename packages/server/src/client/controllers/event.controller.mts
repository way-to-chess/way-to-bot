import { inject, injectable } from "inversify";
import { ClientEventService } from "@way-to-bot/server/client/services/event.service.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import {
  ClientDTOEventGetMany,
  ClientDTOEventGetManyResponse,
  ClientDTOEventGetOne,
  ClientDTOEventGetOneResponse,
} from "@way-to-bot/shared/api/DTO/client/event.DTO.js";

@injectable()
export class ClientEventController {
  constructor(
    @inject(ClientEventService)
    private readonly _eventService: ClientEventService,
  ) {}

  async getMany(options?: GetManyOptionsDTO<EventEntity>) {
    const data = await this._eventService.getMany(options);
    return new ClientDTOEventGetManyResponse(
      data.data.map((i) => new ClientDTOEventGetMany(i)),
      {
        limit: options?.getFindOptions?.take,
        offset: options?.getFindOptions?.skip,
        totalRows: data.count,
      },
    );
  }

  async getById(id: number) {
    const data = await this._eventService.getById(id);
    return new ClientDTOEventGetOneResponse(new ClientDTOEventGetOne(data));
  }
}
