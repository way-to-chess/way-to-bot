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
import { routerEpic } from "../../Utils/RouterEpic";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";

const registrationRouterEpic = routerEpic(
  WEBAPP_ROUTES.registrationRoute,
  () => (action$, state$, dependencies) =>
    createUserEpic({
      onSuccess: () => getUserByTgInfoEpic(action$, state$, dependencies),
    })(action$, state$, dependencies),
);

const appEpic: TAppEpic = (action$, store$, dependencies) =>
  combineEpics(
    userRootEpic,
    eventsRootEpic,
    locationsRootEpic,
    getUserByTgInfoEpic,
    leaguesRootEpic,
    registrationRouterEpic,
    participateRequestsRouterEpic,
  )(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );

export { appEpic };
