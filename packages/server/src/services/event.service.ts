import { dbInstance } from "../database/init";
import { Event as EventEntity } from "../database/entities/event.entity";
import { DeepPartial, In } from "typeorm";
import {
  IAddUsersToEventPayload,
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
  IRemoveUsersFromEventPayload,
} from "../interfaces/event.interface";
import { Location } from "../database/entities/location.entity";
import { User } from "../database/entities/user.entity";

export class EventService {
  private eventRepository = dbInstance.getRepository(EventEntity);

  getEventById = async (eventId: number) => {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: {
        location: {
          preview: true,
        },
        users: {
          photo: true,
        },
      },
    });

    if (!event) {
      throw new Error(`Event with id ${eventId} not found`);
    }

    return event;
  };

  getAllEvents = async () => {
    return this.eventRepository.find({
      relations: {
        location: {
          preview: true,
        },
        users: {
          photo: true,
        },
      },
    });
  };

  createEvent = async (event: IEventCreatePayload) => {
    const locationRepository = dbInstance.getRepository(Location);

    const newEvent = this.eventRepository.create(
      event as DeepPartial<EventEntity>,
    );
    if (event.locationId) {
      const location = await locationRepository.findOneBy({
        id: event.locationId,
      });
      if (!location) {
        throw new Error(`Location with id ${event.locationId} not found`);
      }
      newEvent.location = location;
    }

    return this.eventRepository.save(newEvent);
  };

  updateEvent = async (event: IEventUpdatePayload) => {
    const locationRepository = dbInstance.getRepository(Location);

    const existingEvent = await this.eventRepository.findOneBy({
      id: event.id,
    });

    if (!existingEvent) {
      throw new Error(`Event with id ${event.id} not found`);
    }

    if (event.locationId) {
      const location = await locationRepository.findOneBy({
        id: event.locationId,
      });
      if (!location) {
        throw new Error(`Location with id ${event.locationId} not found`);
      }
      existingEvent.location = location;
    } else if (event.locationId === null) {
      existingEvent.location = null;
    }

    const updatedEvent = this.eventRepository.merge(
      existingEvent,
      event as DeepPartial<EventEntity>,
    );

    return this.eventRepository.save(updatedEvent);
  };

  deleteEvent = async (payload: IEventDeletePayload) => {
    const { eventId } = payload;
    const existingEvent = await this.eventRepository.findOneBy({
      id: eventId,
    });

    if (!existingEvent) {
      throw new Error(`Event with id ${eventId} not found`);
    }

    const eventDeleted = await this.eventRepository.delete(eventId);

    return eventDeleted.affected === 1;
  };

  addUsersToEvent = async (payload: IAddUsersToEventPayload) => {
    const { userIds, eventId } = payload;
    const userRepository = dbInstance.getRepository(User);

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: {
        users: true,
      },
    });

    if (!event) {
      throw new Error(`Event with id ${eventId} not found`);
    }

    const existingUserIds = event.users.map((user) => user.id);
    const newUsers = await userRepository.find({
      where: {
        id: In(userIds.filter((userId) => !existingUserIds.includes(userId))),
      },
    });

    event.users = [...event.users, ...newUsers];

    await this.eventRepository.save(event);
    return event.users;
  };

  removeUsersFromEvent = async (payload: IRemoveUsersFromEventPayload) => {
    const { userIds, eventId } = payload;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: {
        users: true,
      },
    });

    if (!event) {
      throw new Error(`Event with id ${eventId} not found`);
    }

    event.users = event.users.filter((user) => !userIds.includes(user.id));
    await this.eventRepository.save(event);

    return event.users;
  };
}
