import { inject, injectable } from "inversify";
import { AdminEventService } from "@way-to-bot/server/admin/services/event.service.mjs";
import {
  TAdminEventCreatePayload,
  TAdminEventUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/event.schema.js";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity.mjs";
import {
  AdminDTOEventCreateResponse,
  AdminDTOEventDeleteResponse,
  AdminDTOEventGetMany,
  AdminDTOEventGetManyResponse,
  AdminDTOEventGetOne,
  AdminDTOEventGetOneResponse,
  AdminDTOEventUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/event.DTO.js";

@injectable()
export class AdminEventController {
  constructor(
    @inject(AdminEventService)
    private readonly _eventService: AdminEventService,
  ) {}

  async getMany(options?: GetManyOptionsDTO<EventEntity>) {
    const data = await this._eventService.getMany(options);
    return new AdminDTOEventGetManyResponse(
      data.data.map((i) => new AdminDTOEventGetMany(i)),
      {
        itemsPerPage: options?.getFindOptions?.take,
        pageNumber: options?.getFindOptions?.skip,
        totalRows: data.count,
      },
    );
  }

  async getById(id: number) {
    const data = await this._eventService.getById(id);
    return new AdminDTOEventGetOneResponse(new AdminDTOEventGetOne(data));
  }

  async create(payload: TAdminEventCreatePayload) {
    const data = await this._eventService.create(payload);
    return new AdminDTOEventCreateResponse(new AdminDTOEventGetOne(data));
  }

  async update(id: number, payload: TAdminEventUpdatePayload) {
    const data = await this._eventService.update(id, payload);
    return new AdminDTOEventUpdateResponse(new AdminDTOEventGetOne(data));
  }

  async delete(id: number) {
    const data = await this._eventService.delete(id);
    return new AdminDTOEventDeleteResponse(data);
  }
}
