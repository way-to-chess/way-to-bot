import { type Action } from "@reduxjs/toolkit";
import { type Epic } from "redux-observable";
import { httpApi } from "../../../HttpApi/HttpApi";
import { type AppState } from "../CreateStore";

interface IAppEpicDependencies {
  httpApi: typeof httpApi;
}

type TAppEpic<
  Input extends Action = Action,
  Output extends Input = Input,
  State = AppState,
> = Epic<Input, Output, State, IAppEpicDependencies>;

export type { TAppEpic, IAppEpicDependencies };
