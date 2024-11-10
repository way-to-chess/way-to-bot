import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ILeagueCreatePayload,
  ILeagueDeletePayload,
  ILeagueUpdatePayload,
} from "@way-to-bot/shared/interfaces/league.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { LeagueEntity } from "@way-to-bot/shared/entities/league.entity";

interface ILeaguesSliceState {
  leagues: LeagueEntity[];
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
      { payload }: PayloadAction<IResponseWithData<LeagueEntity[]>>,
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
