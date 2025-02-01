import { TAppEpic } from "../App/Epics/TAppEpic";
import { httpRequestEpicFactory } from "../Utils/HttpRequestEpicFactory";
import { LEAGUES_LOAD_REQUEST_SYMBOL } from "./LeaguesVariables";
import { leaguesSlice } from "./LeaguesSlice";

const loadLeaguesEpic: TAppEpic = (action$, state$, dependencies) => {
  return httpRequestEpicFactory({
    input: dependencies.httpApi.getAllLeagues(),
    requestSymbol: LEAGUES_LOAD_REQUEST_SYMBOL,
    receivedActionCreator: leaguesSlice.actions.leaguesReceived,
  });
};

export { loadLeaguesEpic };
