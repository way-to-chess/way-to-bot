import { dbInstance } from "../database/init";
import { FileEntity } from "../database/entities/file.entity";
import { DeepPartial } from "typeorm";
import { ParticipateRequestEntity } from "../database/entities/participate-request.entity";
import { EventEntity } from "../database/entities/event.entity";
import { UserEntity } from "../database/entities/user.entity";
import {
  IParticipantRequestDeletePayload,
  IParticipateRequestCreatePayload,
  IParticipateRequestUpdatePayload,
} from "../interfaces/participate-request.interface";

export class ParticipateRequestService {
  private participateRequestRepository = dbInstance.getRepository(
    ParticipateRequestEntity,
  );
  private eventRepository = dbInstance.getRepository(EventEntity);
  private userRepository = dbInstance.getRepository(UserEntity);
  private fileRepository = dbInstance.getRepository(FileEntity);

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
}
