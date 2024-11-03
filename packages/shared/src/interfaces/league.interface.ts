import { IEventUserLeague } from "./eventUserLeague.interface";

interface ILeague {
  id: number;
  name: string;
  eventsUsersLeagues: IEventUserLeague[];
}

export { ILeague };
