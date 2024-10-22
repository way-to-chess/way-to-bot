import {
  Action,
  ActionCreatorWithPayload,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { OperatorFunction } from "rxjs";

const fromActionCreator = <AC extends ActionCreatorWithPayload<any>>(
  actionCreator: AC,
): OperatorFunction<Action, PayloadAction<Parameters<AC>[0]>> => {
  return ofType(actionCreator.type);
};

export { fromActionCreator };
