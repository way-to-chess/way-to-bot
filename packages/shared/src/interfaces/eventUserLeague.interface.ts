import { IEvent } from "./event.interface";
import { IUser } from "./user.interface";
import { ILeague } from "./league.interface";

interface IEventUserLeague {
  id: number;
  event: IEvent;
  user: IUser;
  league: ILeague;
}

export { IEventUserLeague };
