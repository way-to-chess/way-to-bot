import { catchError } from "rxjs";
import { TAppEpic } from "./TAppEpic";
import { combineEpics } from "redux-observable";
import { userRootEpic } from "../../User/UserRootEpic";

const appEpic: TAppEpic = (action$, store$, dependencies) =>
  combineEpics(userRootEpic)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );

export { appEpic };
