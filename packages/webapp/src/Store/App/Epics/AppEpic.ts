import { catchError } from "rxjs";
import { TAppEpic } from "./TAppEpic";
import { combineEpics } from "redux-observable";
import { userRootEpic } from "../../User/Epics/UserRootEpic";
import { eventsRootEpic } from "../../Events/EventsRootEpic";
import { locationsRootEpic } from "../../Locations/Epics/LocationsRootEpic";
import { leaguesRootEpic } from "../../Leagues/LeaguesRootEpic";
import { createUserEpic } from "../../User/Epics/CreateUserEpic";
import { getUserByTgInfoEpic } from "../../User/Epics/GetUserByTgInfoEpic";
import { participateRequestsRouterEpic } from "../../ParticipateRequest/Epics/ParticipateRequestRootEpic";

const appEpic: TAppEpic = (action$, store$, dependencies) =>
  combineEpics(
    userRootEpic,
    eventsRootEpic,
    locationsRootEpic,
    getUserByTgInfoEpic,
    leaguesRootEpic,
    createUserEpic({
      onSuccess: () => getUserByTgInfoEpic(action$, store$, dependencies),
    }),
    participateRequestsRouterEpic,
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );

export { appEpic };
