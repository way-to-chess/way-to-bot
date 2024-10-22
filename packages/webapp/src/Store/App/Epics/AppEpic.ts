import { combineEpics } from "redux-observable";
import { catchError } from "rxjs";
import { TAppEpic } from "./TAppEpic.ts";
import { userRootEpic } from "../../User/UserRootEpic.ts";
import { locationsRootEpic } from "../../Locations/Epics/LocationsRootEpic.ts";
import { eventsRootEpic } from "../../Events/EventsRootEpic.ts";

const appEpic: TAppEpic = (action$, store$, dependencies) =>
  combineEpics(userRootEpic, locationsRootEpic, eventsRootEpic)(
    action$,
    store$,
    dependencies,
  ).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );

export { appEpic };
