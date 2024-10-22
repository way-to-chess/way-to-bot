import { combineEpics } from "redux-observable";
import { catchError } from "rxjs";
import { TAppEpic } from "./TAppEpic";
import { userRootEpic } from "../../User/UserRootEpic";
import { locationsRootEpic } from "../../Locations/Epics/LocationsRootEpic";
import { eventsRootEpic } from "../../Events/EventsRootEpic";

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
