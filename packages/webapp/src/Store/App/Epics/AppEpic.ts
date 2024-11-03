import { catchError, EMPTY } from "rxjs";
import { TAppEpic } from "./TAppEpic";

const appEpic: TAppEpic = (action$, store$, dependencies) =>
  EMPTY.pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );

export { appEpic };
