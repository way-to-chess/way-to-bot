import { dbInstance } from "../database/init";
import { EventEntity } from "../database/entities/event.entity";
import { DeepPartial, In } from "typeorm";
import {
  IAddUsersToEventPayload,
  IEventCreatePayload,
  IEventDeletePayload,
  IEventUpdatePayload,
  IRemoveUsersFromEventPayload,
} from "../interfaces/event.interface";
import { LocationEntity } from "../database/entities/location.entity";
import { UserEntity } from "../database/entities/user.entity";
import { LeagueEntity } from "../database/entities/league.entity";
import { EventUserLeagueEntity } from "../database/entities/events_users_leagues";
import { FileEntity } from "../database/entities/file.entity";

export class EventService {
  private eventRepository = dbInstance.getRepository(EventEntity);

  getEventById = async (eventId: number) => {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: {
        location: {
          preview: true,
        },
        eventsUsersLeagues: {
          user: { photo: true },
          league: true,
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
        eventsUsersLeagues: {
          user: { photo: true },
          league: true,
        },
      },
    });
  };

  createEvent = async (event: IEventCreatePayload) => {
    const locationRepository = dbInstance.getRepository(LocationEntity);
    const fileRepository = dbInstance.getRepository(FileEntity);

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

    if (event.fileId) {
      const file = await fileRepository.findOneBy({
        id: event.fileId,
      });
      if (!file) {
        throw new Error(`File with id ${event.fileId} not found`);
      }
      newEvent.preview = file;
    }

    return this.eventRepository.save(newEvent);
  };

  updateEvent = async (event: IEventUpdatePayload) => {
    const locationRepository = dbInstance.getRepository(LocationEntity);
    const fileRepository = dbInstance.getRepository(FileEntity);

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

    if (event.fileId) {
      const file = await fileRepository.findOneBy({
        id: event.fileId,
      });
      if (!file) {
        throw new Error(`File with id ${event.fileId} not found`);
      }
      existingEvent.preview = file;
    } else if (event.fileId === null) {
      existingEvent.preview = null;
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
    const { userIds, eventId, leagueId } = payload;
    const userRepository = dbInstance.getRepository(UserEntity);
    const leagueRepository = dbInstance.getRepository(LeagueEntity);
    const eventUserLeagueRepository = dbInstance.getRepository(
      EventUserLeagueEntity,
    );

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: {
        eventsUsersLeagues: {
          user: true,
        },
      },
    });

    if (!event) {
      throw new Error(`Event with id ${eventId} not found`);
    }

    const league = await leagueRepository.findOneBy({ id: leagueId });

    if (!league) {
      throw new Error(`League with id ${leagueId} not found`);
    }

    const existingUserIds = event.eventsUsersLeagues.map((eul) => eul.user.id);
    const newUsers = await userRepository.find({
      where: {
        id: In(userIds.filter((userId) => !existingUserIds.includes(userId))),
      },
    });

    const eulList = newUsers.map((user) => {
      const eul = new EventUserLeagueEntity();
      eul.event = event;
      eul.league = league;
      eul.user = user;
      return eul;
    });

    await eventUserLeagueRepository.save(eulList);
    return true;
  };

  removeUsersFromEvent = async (payload: IRemoveUsersFromEventPayload) => {
    const { userIds, eventId, leagueId } = payload;
    const eventUserLeagueRepository = dbInstance.getRepository(
      EventUserLeagueEntity,
    );

    const result = await eventUserLeagueRepository.delete({
      league: { id: leagueId },
      event: { id: eventId },
      user: { id: In(userIds) },
    });

    return !!result.affected;
  };
}
