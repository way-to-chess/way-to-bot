import { inject, injectable } from "inversify";
import { FindOptionsWhere } from "typeorm";
import { ParticipateRequestRepository } from "@way-to-bot/server/database/repositories/participate-request.repository";
import { TClientParticipateRequestCreatePayload } from "@way-to-bot/shared/api/zod/client/participate-request.schema";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { EOperandPredicate } from "@way-to-bot/shared/api/enums/EOperandPredicate";
import { EPredicate } from "@way-to-bot/shared/api/enums/EPredicate";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity";

@injectable()
export class ClientParticipateRequestService {
  constructor(
    @inject(ParticipateRequestRepository)
    private readonly _participateRequestRepository: ParticipateRequestRepository,
    @inject(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  async getMany(userId: number, options?: TCommonGetManyOptions) {
    if (!options) {
      options = {};
    }
    const savedOptionsWhere = options.where ? options.where : null;
    options.where = {
      predicate: EPredicate.AND,
      operands: [
        { field: "userId", predicate: EOperandPredicate.EQ, value: userId },
      ],
    };

    if (savedOptionsWhere) options.where.operands.push(savedOptionsWhere);

    return this._participateRequestRepository.getMany(options);
  }

  async getById(id: number) {
    const data = await this._participateRequestRepository.getOne({
      where: { id },
    });

    if (!data) {
      throw new NotFoundError(`Participate request with id ${id} not found`);
    }

    return data;
  }

  async create(
    payload: TClientParticipateRequestCreatePayload
  ) {
    let mainUserId: number | null = null; 

    const users = [...payload.additionalUsers].sort((a, b) => {
      const ka = String(a.id ?? a.tgId ?? a.email ?? a.phoneNumber ?? a.username ?? "");
      const kb = String(b.id ?? b.tgId ?? b.email ?? b.phoneNumber ?? b.username ?? "");
      return ka.localeCompare(kb);
    });

    for (const u of users) {
      const index = payload.additionalUsers.findIndex(
        (x) => x === u,
      );

      const orConditions: FindOptionsWhere<UserEntity>[] = [];
      if (u.id !== undefined && u.id !== null) {
        orConditions.push({ id: u.id });
      }
      if (u.tgId) {
        orConditions.push({ tgId: u.tgId });
      }
      if (u.username) {
        orConditions.push({ username: u.username });
      }
      if (u.email) {
        orConditions.push({ email: u.email });
      }
      if (u.phoneNumber) {
        orConditions.push({ phoneNumber: u.phoneNumber });
      }

      let user =
        orConditions.length > 0
          ? await this._userRepository.getOne({
              where: orConditions,
              relations: undefined,
            })
          : null;

      if (!user) {
        const { elIds, id, ...createPayload } = u;
        user = await this._userRepository.create(createPayload);
        if (!user) {
          throw new NotFoundError(`User was not created`);
        }
      } else {
        await this._userRepository.update(user.id, {
          ...(!user.firstName?.trim() && u.firstName && { firstName: u.firstName }),
          ...(!user.lastName?.trim() && u.lastName && { lastName: u.lastName }),
          ...(!user.birthDate && u.birthDate && { birthDate: u.birthDate }),
          ...(!user.username && u.username && { username: u.username }),
          ...(!user.email && u.email && { email: u.email }),
          ...(!user.phoneNumber && u.phoneNumber && { phoneNumber: u.phoneNumber }),
        });
      }

      if (user.tgId === payload.tgId) {
        mainUserId = user.id;
      }

      if (index !== -1) {
        payload.additionalUsers[index]!.id = user.id;
      }
    }

    if (!mainUserId && payload.tgId) {
      const mainUser = await this._userRepository.getOne({
        where: { tgId: payload.tgId },
        relations: undefined,
      });
      if (mainUser) {
        mainUserId = mainUser.id;
      }
    }

    if (!mainUserId) {
      throw new BadRequestError("Main user not found");
    }

    const data = await this._participateRequestRepository.create({
      ...payload,
      userId: mainUserId,
    });

    if (!data) {
      throw new NotFoundError(`Participate request was not created`);
    }

    return data;
  }

  delete(id: number) {
    return this._participateRequestRepository.delete(id);
  }
}
