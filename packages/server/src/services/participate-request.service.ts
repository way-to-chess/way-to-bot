import { dbInstance } from "../database/init";
import { FileEntity } from "../database/entities/file.entity";
import { DeepPartial, EntityManager } from "typeorm";
import { ParticipateRequestEntity } from "../database/entities/participate-request.entity";
import { EventEntity } from "../database/entities/event.entity";
import { UserEntity } from "../database/entities/user.entity";
import {
  IParticipantRequestDeletePayload,
  IParticipateRequestApprovePayload,
  IParticipateRequestCreatePayload,
  IParticipateRequestUpdatePayload,
} from "../interfaces/participate-request.interface";
import { EventUserLeagueEntity } from "../database/entities/events-users-leagues.entity";

export class ParticipateRequestService {
  private participateRequestRepository = dbInstance.getRepository(
    ParticipateRequestEntity,
  );
  private eventRepository = dbInstance.getRepository(EventEntity);
  private userRepository = dbInstance.getRepository(UserEntity);
  private fileRepository = dbInstance.getRepository(FileEntity);
  private transactionManager: EntityManager | null;

  constructor(transactionManager: EntityManager | null = null) {
    this.transactionManager = transactionManager;
  }

  getAllParticipateRequests = async () => {
    return this.participateRequestRepository.find({
      relations: {
        receipt: true,
        user: { photo: true },
        event: true,
      },
    });
  };

  getParticipateRequestById = async (id: number) => {
    const participateRequest = await this.participateRequestRepository.findOne({
      where: { id },
      relations: {
        receipt: true,
        user: { photo: true },
        event: true,
      },
    });

    if (!participateRequest) {
      throw new Error(`Participate request with ID ${id} not found`);
    }

    return participateRequest;
  };

  createParticipateRequest = async (
    payload: IParticipateRequestCreatePayload,
  ) => {
    const newParticipateRequest = this.participateRequestRepository.create(
      payload as DeepPartial<ParticipateRequestEntity>,
    );

    const event = await this.eventRepository.findOneBy({ id: payload.eventId });

    if (!event) {
      throw new Error(`Event with ID ${payload.eventId} not found`);
    }

    newParticipateRequest.event = event;

    const user = await this.userRepository.findOneBy({ id: payload.userId });

    if (!user) {
      throw new Error(`User with ID ${payload.userId} not found`);
    }

    newParticipateRequest.user = user;

    if (payload.fileId) {
      const file = await this.fileRepository.findOneBy({ id: payload.fileId });
      if (!file) {
        throw new Error(`File with ID ${payload.fileId} not found`);
      }
      newParticipateRequest.receipt = file;
    }

    return this.participateRequestRepository.save(newParticipateRequest);
  };

  updateParticipateRequest = async (
    payload: IParticipateRequestUpdatePayload,
  ) => {
    const participateRequest = await this.participateRequestRepository.findOne({
      where: {
        id: payload.id,
      },
      relations: {
        event: true,
        user: true,
        receipt: true,
      },
    });

    if (!participateRequest) {
      throw new Error(`Participate request with ID ${payload.id} not found`);
    }

    if (payload.fileId) {
      const file = await this.fileRepository.findOneBy({ id: payload.fileId });
      if (!file) {
        throw new Error(`File with id ${payload.fileId} not found`);
      }
      participateRequest.receipt = file;
    } else if (payload.fileId === null) {
      participateRequest.receipt = null;
    }

    const updatedParticipateRequest = this.participateRequestRepository.merge(
      participateRequest,
      payload as DeepPartial<ParticipateRequestEntity>,
    );

    return this.participateRequestRepository.save(updatedParticipateRequest);
  };

  deleteParticipateRequest = async (
    payload: IParticipantRequestDeletePayload,
  ) => {
    const { id } = payload;
    const participateRequest =
      await this.participateRequestRepository.findOneBy({
        id,
      });

    if (!participateRequest) {
      throw new Error(`Participate request with ID ${id} not found`);
    }

    const participateRequestDeleted =
      await this.participateRequestRepository.delete(id);

    return participateRequestDeleted.affected === 1;
  };

  approveParticipateRequest = async (
    payload: IParticipateRequestApprovePayload,
  ) => {
    if (!this.transactionManager) {
      throw new Error("API error. Transaction must be passed to this service");
    }
    const { leagueId, id } = payload;

    const participateRequest =
      await this.participateRequestRepository.findOneBy({ id });

    if (!participateRequest) {
      throw new Error("Participate request is not found");
    }
    if (participateRequest.approved) {
      throw new Error("Participate request is already approved");
    }

    participateRequest.approved = true;
    await this.transactionManager.save(participateRequest);

    const eulRepository = dbInstance.getRepository(EventUserLeagueEntity);
    const newEul = eulRepository.create({
      userId: participateRequest.userId,
      eventId: participateRequest.eventId,
      leagueId,
    });

    await this.transactionManager.save(newEul);
    return newEul;
  };
}
