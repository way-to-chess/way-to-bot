import {
  catchError,
  concat,
  EMPTY,
  from,
  merge,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { requestManagerSlice } from "../RequestManager/RequestManagerSlice";
import { IWithError } from "@way-to-bot/shared/interfaces/error.interface";
import { PayloadActionCreator } from "@reduxjs/toolkit";

interface IHttpRequestEpicFactoryProps<T> {
  input: Promise<T | IWithError>;
  requestSymbol: string;
  receivedActionCreator?: PayloadActionCreator<T>;
  onSuccess?: (result: T) => Observable<any>;
  onError?: (error: string) => Observable<any>;
}

const httpRequestEpicFactory = <T>({
  input,
  requestSymbol,
  receivedActionCreator,
  onSuccess,
  onError,
}: IHttpRequestEpicFactoryProps<T>) =>
  concat(
    of(requestManagerSlice.actions.loading({ symbol: requestSymbol })),
    from(input).pipe(
      switchMap((result) => {
        if (
          typeof result === "object" &&
          result !== null &&
          "error" in result
        ) {
          return concat(
            of(
              requestManagerSlice.actions.error({
                symbol: requestSymbol,
                error: JSON.stringify(result.error),
              }),
            ),
            onError ? onError(result.error) : EMPTY,
          );
        }

        return concat(
          merge(
            of(requestManagerSlice.actions.success({ symbol: requestSymbol })),
            receivedActionCreator ? of(receivedActionCreator(result)) : EMPTY,
            onSuccess ? onSuccess(result) : EMPTY,
          ),
        );
      }),
      catchError((err) => {
        console.error(err);

        return EMPTY;
      }),
    ),
  );

export { httpRequestEpicFactory };
export type { IHttpRequestEpicFactoryProps };
