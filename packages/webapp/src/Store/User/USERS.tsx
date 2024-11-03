import { IUser } from "@way-to-bot/shared/interfaces/user.interface";
import { EUserRole } from "@way-to-bot/shared/enums";
import { EVENTS } from "../Events/EVENTS";

export const USERS: IUser[] = [
  {
    id: 1,
    events: EVENTS,
    firstName: "Sasha",
    lastName: "MeNuke",
    username: "privetenn",
    total: 3,
    wins: 1,
    draws: 1,
    losses: 1,
    rating: 123,
    roles: [EUserRole.USER],
    winRate: 0.5,
    photo: {
      id: 1,
      url: `https://api.dicebear.com/7.x/miniavs/svg?seed=privetenn`,
    },
    createdAt: 123,
    updatedAt: 123,
  },
  {
    id: 1,
    events: [],
    firstName: "Ignat",
    lastName: "Stuffin",
    username: "traktirwik",
    total: 3,
    wins: 1,
    draws: 1,
    losses: 1,
    rating: 123,
    roles: [EUserRole.USER],
    winRate: 0.5,
    photo: {
      id: 2,
      url: `https://api.dicebear.com/7.x/miniavs/svg?seed=traktirwik`,
    },
    createdAt: 123,
    updatedAt: 123,
  },
];
