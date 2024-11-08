import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILeague } from "@way-to-bot/shared/interfaces/league.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import {
  ILeagueCreatePayload,
  ILeagueDeletePayload,
  ILeagueUpdatePayload,
} from "@way-to-bot/server/interfaces/league.interface";

interface ILeaguesSliceState {
  leagues: ILeague[];
}

const initialState: ILeaguesSliceState = {
  leagues: [],
};

const leaguesSlice = createSlice({
  name: "leagues",
  initialState,
  reducers: {
    leaguesReceived: (
      state,
      { payload }: PayloadAction<IResponseWithData<ILeague[]>>,
    ) => {
      state.leagues = payload.data;
    },
    createLeague: (_, __: PayloadAction<ILeagueCreatePayload>) => {},
    updateLeague: (_, __: PayloadAction<ILeagueUpdatePayload>) => {},
    deleteLeague: (_, __: PayloadAction<ILeagueDeletePayload>) => {},
  },
  selectors: {
    leagues: (sliceState) => sliceState.leagues,
  },
});

export { leaguesSlice };
