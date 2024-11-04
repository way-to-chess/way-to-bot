import { catchError } from "rxjs";
import { TAppEpic } from "./TAppEpic";
import { combineEpics } from "redux-observable";
import { userRootEpic } from "../../User/UserRootEpic";
import { eventsRootEpic } from "../../Events/EventsRootEpic";
import { locationsRootEpic } from "../../Locations/Epics/LocationsRootEpic";

const appEpic: TAppEpic = (action$, store$, dependencies) =>
  combineEpics(userRootEpic, eventsRootEpic, locationsRootEpic)(
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
