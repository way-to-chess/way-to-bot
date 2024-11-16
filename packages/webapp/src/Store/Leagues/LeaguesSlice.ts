import { createSlice } from "@reduxjs/toolkit";
import {
  ILeagueCreatePayload,
  ILeagueDeletePayload,
  ILeagueUpdatePayload,
} from "@way-to-bot/shared/interfaces/league.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { LeagueEntity } from "@way-to-bot/shared/entities/league.entity";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "../../HttpApi/RequestUtils";

interface ILeaguesSliceState {
  leagues: LeagueEntity[];
}

const initialState: ILeaguesSliceState = {
  leagues: [],
};

const leaguesApi = createApi({
  reducerPath: "leaguesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_API_URL}/league/` }),
  endpoints: (builder) => ({
    getAll: builder.query<LeagueEntity[], void>({
      query: () => "all",
      transformResponse: (
        baseQueryReturnValue: IResponseWithData<LeagueEntity[]>,
      ) => baseQueryReturnValue.data,
    }),
    createLeague: builder.mutation({
      query: (payload: ILeagueCreatePayload) => ({
        url: "create",
        method: "POST",
        body: payload,
      }),
    }),
    updateLeague: builder.mutation({
      query: (payload: ILeagueUpdatePayload) => ({
        url: "update",
        method: "PUT",
        body: payload,
      }),
    }),
    deleteLeague: builder.mutation({
      query: (payload: ILeagueDeletePayload) => ({
        url: "delete",
        method: "DELETE",
        body: payload,
      }),
    }),
  }),
});

const leaguesSlice = createSlice({
  name: "leagues",
  initialState,
  reducers: {},
  selectors: {
    leagues: (sliceState) => sliceState.leagues,
  },
});

export { leaguesSlice, leaguesApi };
