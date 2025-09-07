import { inject, injectable } from "inversify";
import { ParticipateRequestRepository } from "@way-to-bot/server/database/repositories/participate-request.repository";
import { TClientParticipateRequestCreatePayload } from "@way-to-bot/shared/api/zod/client/participate-request.schema";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { EOperandPredicate } from "@way-to-bot/shared/api/enums/EOperandPredicate";
import { EPredicate } from "@way-to-bot/shared/api/enums/EPredicate";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error";
import { EventRepository } from "@way-to-bot/server/database/repositories/event.repository";
import { EEventStatus } from "@way-to-bot/shared/api/enums/EEventStatus";

@injectable()
export class ClientParticipateRequestService {
  constructor(
    @inject(ParticipateRequestRepository)
    private readonly _participateRequestRepository: ParticipateRequestRepository,
    @inject(UserRepository)
    private readonly _userRepository: UserRepository,
    @inject(EventRepository)
    private readonly _eventRepository: EventRepository,
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
    const event = await this._eventRepository.getOne({
      where: { id: payload.eventId },
      relations: { eventLeagues: true },
    });

    if (!event) {
      throw new NotFoundError(`Event with id ${payload.eventId} not found`);
    }

    if (event.status !== EEventStatus.WAITING) {
      throw new BadRequestError(`Registration is closed for this event`);
    }

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

      let user = await this._userRepository.getOne({
        where: [
          { id: u.id },
          { tgId: u.tgId },
          ...(u.username ? [{ username: u.username }] : []),
          ...(u.email ? [{ email: u.email }] : []),
          ...(u.phoneNumber ? [{ phoneNumber: u.phoneNumber }] : []),
        ],
        relations: undefined,
      });

      if (!user) {
        user = await this._userRepository.create({
          ...u,
        });
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
