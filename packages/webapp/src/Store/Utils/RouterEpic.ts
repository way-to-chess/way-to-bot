import { distinctUntilChanged, EMPTY, map, switchMap } from "rxjs";
import { routerLocationPathnameSelector } from "../Router/RouterSelectors.ts";
import { matchPath, PathMatch } from "react-router-dom";
import { TAppEpic } from "../App/Epics/TAppEpic.ts";

type TRouterEpicCallback = (match: PathMatch) => TAppEpic;

const routerEpic =
  (route: string, epic: TRouterEpicCallback): TAppEpic =>
  (action$, state$, dependencies) =>
    state$.pipe(
      map(routerLocationPathnameSelector),
      distinctUntilChanged(),
      switchMap((pathname) => {
        const match = matchPath(route, pathname);

        if (!match) {
          return EMPTY;
        }

        return epic(match)(action$, state$, dependencies);
      }),
    );

export { routerEpic, type TRouterEpicCallback };
