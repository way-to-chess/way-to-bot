import { inject, injectable } from "inversify";
import { ParticipateRequestRepository } from "@way-to-bot/server/database/repositories/participate-request.repository";
import { TClientParticipateRequestCreatePayload } from "@way-to-bot/shared/api/zod/client/participate-request.schema";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { EOperandPredicate } from "@way-to-bot/shared/api/enums/EOperandPredicate";
import { EPredicate } from "@way-to-bot/shared/api/enums/EPredicate";
import { DbService } from "@way-to-bot/server/services/db.service";
import { UserRepository } from "@way-to-bot/server/database/repositories/user.repository";
import { BadRequestError } from "@way-to-bot/server/common/errors/bad-request.error";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity";

@injectable()
export class ClientParticipateRequestService {
  constructor(
    @inject(ParticipateRequestRepository)
    private readonly _participateRequestRepository: ParticipateRequestRepository,
    @inject(DbService)
    private readonly _dbService: DbService,
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
    payload: TClientParticipateRequestCreatePayload,
  ) {
    const queryRunner = this._dbService.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let mainUserId: number | null = null;


      const promises: Promise<UserEntity>[] = [];

      payload.additionalUsers.forEach((u, index) => {
        const promise = new Promise<UserEntity>(async (resolve, reject) => {
          let user = await this._userRepository.getOne({
            where: [
              { id: u.id },
              { tgId: u.tgId },
              ...(u.username ? [{ username: u.username }] : []),
              ...(u.email ? [{ email: u.email }] : []),
              ...(u.phoneNumber ? [{ phoneNumber: u.phoneNumber }] : []),
            ],
          });

          if (!user) {
            user = await this._userRepository.create({
              ...u,
            }, queryRunner);

            if (!user) {
              return reject(`Error while creating user ${u}`);
            }
          } else {
            await this._userRepository.update(user.id, {
              ...(u.firstName && { firstName: u.firstName }),
              ...(u.lastName && { lastName: u.lastName }),
              ...(u.birthDate && { birthDate: u.birthDate }),
              ...(u.username && { username: u.username }),
              ...(u.email && { email: u.email }),
              ...(u.phoneNumber && { phoneNumber: u.phoneNumber }),
            }, queryRunner);
          }

          if (user.tgId === payload.tgId) {
            mainUserId = user.id;
          }

          payload.additionalUsers[index]!.id = user.id;
          resolve(user);
        });

        promises.push(promise);
      });

      await Promise.all(promises);


      if (!mainUserId) {
        throw new BadRequestError("Main user not found");
      }

      const data = await this._participateRequestRepository.create(
        {
          ...payload,
          userId: mainUserId,
        },
        queryRunner,
      );

      if (!data) {
        throw new NotFoundError(`Participate request was not created`);
      }

      await queryRunner.commitTransaction();
      return data;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  delete(id: number) {
    return this._participateRequestRepository.delete(id);
  }
}
