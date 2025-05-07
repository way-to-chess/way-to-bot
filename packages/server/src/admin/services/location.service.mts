import { inject, injectable } from "inversify";
import { LocationRepository } from "@way-to-bot/server/database/repositories/location.repository.mjs";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error.mjs";
import {
  TAdminLocationCreatePayload,
  TAdminLocationUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/location.schema.js";
import { LocationEntity } from "@way-to-bot/server/database/entities/location.entity.mjs";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";

@injectable()
export class AdminLocationService {
  constructor(
    @inject(LocationRepository)
    private readonly _locationRepository: LocationRepository,
  ) {}

  async getMany(options?: GetManyOptionsDTO<LocationEntity>) {
    return this._locationRepository.getMany(options?.getFindOptions);
  }

  async getOne(id: number) {
    const data = await this._locationRepository.getById(id);

    if (!data) {
      throw new NotFoundError(`Location with id ${id} not found`);
    }

    return data;
  }

  async create(payload: TAdminLocationCreatePayload) {
    const newLocation = await this._locationRepository.create(payload);

    if (!newLocation) {
      throw new InternalError("Location was not created");
    }

    return newLocation;
  }

  async update(id: number, payload: TAdminLocationUpdatePayload) {
    const updatedLocation = await this._locationRepository.update(id, payload);

    if (!updatedLocation) {
      throw new InternalError("Location was not updated");
    }

    return updatedLocation;
  }

  async delete(id: number) {
    return this._locationRepository.delete(id);
  }
}
