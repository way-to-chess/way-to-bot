import { TEventController } from "../../../src/routers/event.router.ts";

type TEvent = Omit<
  Awaited<ReturnType<TEventController["getAllEvents"]>>[number],
  "calculateWinRateAndTotal" | "dateTime"
> & {
  dateTime: null | string;
};

type TEventTeams = TEvent["teams"];

type TEventGame = TEvent["games"][number];

type TEventGameTeam = TEventGame["gameTeams"][0]["team"];

interface IWithEvent {
  event: TEvent;
}

export type { TEvent, TEventGame, TEventGameTeam, IWithEvent, TEventTeams };
