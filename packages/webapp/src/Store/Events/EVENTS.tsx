import { IEvent } from "@way-to-bot/shared/interfaces/event.interface";
import { LOCATIONS } from "../Locations/LOCATIONS";
import { EEventStatus, EUserRole } from "@way-to-bot/shared/enums";

export const EVENTS: IEvent[] = [
  {
    id: 1,
    dateTime: Date.now(),
    location: LOCATIONS[0],
    participantsLimit: 20,
    price: "40 BYN",
    status: EEventStatus.WAITING,
    users: [
      {
        id: 1,
        events: [],
        firstName: "Sasha",
        lastName: "Nuke",
        username: "privetenn",
        total: 3,
        wins: 1,
        draws: 1,
        losses: 1,
        rating: 123,
        roles: [EUserRole.USER],
        winRate: 0.5,
        photo: null,
        createdAt: 123,
        updatedAt: 123,
      },
    ],
    updatedAt: 123,
    createdAt: 123,
  },
];
