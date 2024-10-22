import { AppState } from "../App/CreateStore.ts";
import { reduxRouterSelector } from "@lagunovsky/redux-react-router";

const routerLocationSelector = (state: AppState) =>
  reduxRouterSelector(state).location;

const routerLocationPathnameSelector = (state: AppState) =>
  routerLocationSelector(state).pathname;

export { routerLocationPathnameSelector };
