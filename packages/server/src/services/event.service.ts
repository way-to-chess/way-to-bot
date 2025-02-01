import { dbInstance } from "../database/init";
import { EventEntity } from "../database/entities/event.entity";
import { DeepPartial, In, IsNull, Not } from "typeorm";
import {
  IAddUsersToEventPayload,
  IEventCreatePayload,
  IEventDeletePayload,
  IEventsLeaguesUpdate,
  IEventUpdatePayload,
  IRemoveUsersFromEventPayload,
} from "../interfaces/event.interface";
import { LocationEntity } from "../database/entities/location.entity";
import { UserEntity } from "../database/entities/user.entity";
import { LeagueEntity } from "../database/entities/league.entity";
import { EventUserLeagueEntity } from "../database/entities/events-users-leagues.entity";
import { FileEntity } from "../database/entities/file.entity";
import { TgBotService } from "../tg-bot/init";
import moment from "moment";
import { EventsLeaguesEntity } from "../database/entities/events-leagues.entity";

export class EventService {
  private eventRepository = dbInstance.getRepository(EventEntity);

  getEventById = async (eventId: number) => {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: {
        preview: true,
        location: {
          preview: true,
        },
        eventsUsersLeagues: {
          user: { photo: true },
          league: true,
        },
        participateRequests: {
          user: { photo: true },
          receipt: true,
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
        preview: true,
        location: {
          preview: true,
        },
        eventsUsersLeagues: {
          user: { photo: true },
          league: true,
        },
        participateRequests: true,
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

    const createdEvent = await this.eventRepository.create(newEvent);

    if (!createdEvent) {
      throw new Error("Event was not created");
    }

    setImmediate(async () => {
      try {
        await this.sendMessagesToUsersTg(createdEvent);
      } catch (e) {
        console.error(e);
      }
    });

    await this.eventRepository.save(createdEvent);

    return createdEvent;
  };

  private sendMessagesToUsersTg = async (event: EventEntity) => {
    const userRepository = dbInstance.getRepository(UserEntity);
    const usersWithTgId = await userRepository.find({
      where: { tgId: Not(IsNull()) },
    });

    const tgBotService = TgBotService.getInstance();
    const bot = tgBotService.getBot;
    let usersCount = 0;
    for (const u of usersWithTgId) {
      await bot.sendMessage(
        u.tgId!,
        "Всем привет! 👋\n" +
          "\n" +
          `Открыта регистрация на "${event.name}" ${moment(event.dateTime!, "", "ru").format("dd DD MMMM YYYY, hh:mm")}\n` +
          "\n" +
          "Что играем?\n" +
          "\n" +
          "Жеребьевка по швейцарской системе. Играем 7 туров.\n" +
          "Рапид 10+2 (добавление 2 секунды на ход)\n" +
          "Стоимость 40р. 50% денег от взносов идёт на благотворительность.\n" +
          "\n" +
          "\n" +
          "Зарегестрироваться можно через нашего бота @way_to_chess_bot!\n",
      );
      usersCount++;
      if (usersCount === 25) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
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

    const event = await this.eventRepository
      .createQueryBuilder("event")
      .leftJoinAndSelect(
        "event.eventsUsersLeagues",
        "eventsUsersLeagues",
        '"eventsUsersLeagues".league_Id = :leagueId',
        { leagueId },
      )
      .leftJoinAndSelect("eventsUsersLeagues.user", "user")
      .leftJoinAndSelect("eventsUsersLeagues.league", "league")
      .where("event.id = :eventId", { eventId })
      .getOne();

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

  updateEventLeague = async (payload: IEventsLeaguesUpdate) => {
    const { eventId, leagueId, link } = payload;
    const eventLeaguesRepository =
      dbInstance.getRepository(EventsLeaguesEntity);

    const eventLeague = await eventLeaguesRepository.findOneBy({
      event: { id: eventId },
      league: { id: leagueId },
    });

    if (!eventLeague) {
      throw new Error(
        `League with ID ${leagueId} is not found in event with ID ${eventId}`,
      );
    }

    eventLeague.link = link;

    await eventLeaguesRepository.save(eventLeague);
    return eventLeague;
  };
}
