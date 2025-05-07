import { inject, injectable } from "inversify";
import { AdminLocationService } from "@way-to-bot/server/admin/services/location.service.mjs";
import {
  TAdminLocationCreatePayload,
  TAdminLocationUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/location.schema.js";
import { LocationEntity } from "@way-to-bot/server/database/entities/location.entity.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import {
  AdminDTOLocationCreateResponse,
  AdminDTOLocationDeleteResponse,
  AdminDTOLocationGetMany,
  AdminDTOLocationGetManyResponse,
  AdminDTOLocationGetOne,
  AdminDTOLocationGetOneResponse,
  AdminDTOLocationUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/location.DTO.js";

@injectable()
export class AdminLocationController {
  constructor(
    @inject(AdminLocationService)
    private readonly _locationService: AdminLocationService,
  ) {}

  async getMany(options?: GetManyOptionsDTO<LocationEntity>) {
    const data = await this._locationService.getMany(options);
    return new AdminDTOLocationGetManyResponse(
      data.data.map((i) => new AdminDTOLocationGetMany(i)),
      {
        itemsPerPage: options?.getFindOptions?.take,
        pageNumber: options?.getFindOptions?.skip,
        totalRows: data.count,
      },
    );
  }

  async getOne(id: number) {
    const data = await this._locationService.getOne(id);
    return new AdminDTOLocationGetOneResponse(new AdminDTOLocationGetOne(data));
  }

  async create(payload: TAdminLocationCreatePayload) {
    const data = await this._locationService.create(payload);
    return new AdminDTOLocationCreateResponse(new AdminDTOLocationGetOne(data));
  }

  async update(id: number, payload: TAdminLocationUpdatePayload) {
    const data = await this._locationService.update(id, payload);
    return new AdminDTOLocationUpdateResponse(new AdminDTOLocationGetOne(data));
  }

  async delete(id: number) {
    const data = await this._locationService.delete(id);
    return new AdminDTOLocationDeleteResponse(data);
  }
}
