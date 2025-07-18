import { inject, injectable } from "inversify";
import { LeagueRepository } from "@way-to-bot/server/database/repositories/league.repository";
import { InternalError } from "@way-to-bot/server/common/errors/internal.error";
import {
  TAdminLeagueCreatePayload,
  TAdminLeagueUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/league.schema";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";

@injectable()
export class AdminLeagueService {
  constructor(
    @inject(LeagueRepository)
    private readonly _leagueRepository: LeagueRepository,
  ) {}

  async getMany(options?: TCommonGetManyOptions) {
    return this._leagueRepository.getMany(options);
  }

  async getOne(id: number) {
    const data = await this._leagueRepository.getOne({ where: { id } });

    if (!data) {
      throw new NotFoundError(`League with id ${id} not found`);
    }

    return data;
  }

  async create(payload: TAdminLeagueCreatePayload) {
    const newLeague = await this._leagueRepository.create(payload);

    if (!newLeague) {
      throw new InternalError("League was not created");
    }

    return newLeague;
  }

  async update(id: number, payload: TAdminLeagueUpdatePayload) {
    const updatedLeague = await this._leagueRepository.update(id, payload);

    if (!updatedLeague) {
      throw new InternalError("League was not updated");
    }

    return updatedLeague;
  }

  async delete(id: number) {
    return this._leagueRepository.delete(id);
  }
}
