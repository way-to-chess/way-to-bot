import { inject, injectable } from "inversify";
import { LocationRepository } from "@way-to-bot/server/database/repositories/location.repository";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error";
import {
  TAdminLocationCreatePayload,
  TAdminLocationUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/location.schema";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";

@injectable()
export class AdminLocationService {
  constructor(
    @inject(LocationRepository)
    private readonly _locationRepository: LocationRepository,
  ) {}

  async getMany(options?: TCommonGetManyOptions) {
    return this._locationRepository.getMany(options);
  }

  async getOne(id: number) {
    const data = await this._locationRepository.getOne({ where: { id } });

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
