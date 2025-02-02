import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "@way-to-bot/shared/constants/envs";
import {
  IParticipateRequest,
  IParticipateRequestApprovePayload,
} from "@way-to-bot/shared/interfaces/participate-request.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { message } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { ILeague } from "@way-to-bot/shared/interfaces/league.interface";
import { entitySlice } from "./EntitySlice";
import { PARTICIPATE_REQUESTS_DRAWER_ID } from "./Constants/EntityIds";

const transformResponse = <Data>(response: IResponseWithData<Data>) =>
  response.data;

const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
  }),
  endpoints: (build) => ({
    getAllParticipateRequests: build.query<IParticipateRequest[], void>({
      query: () => "participateRequest/all",
      transformResponse,
    }),
    approveParticipateRequest: build.mutation({
      query: (payload: IParticipateRequestApprovePayload) => ({
        url: "participateRequest/approve",
        method: "POST",
        body: payload,
      }),
      onQueryStarted: (_, { queryFulfilled, dispatch }) => {
        queryFulfilled
          .then(() => {
            message.success(TEXT.success);

            return dispatch(
              api.endpoints.getAllParticipateRequests.initiate(),
            ).refetch();
          })
          .then(() => {
            dispatch(
              entitySlice.actions.removeEntity(PARTICIPATE_REQUESTS_DRAWER_ID),
            );
          })
          .catch((response) => {
            message.error(JSON.stringify(response.error.data, null, 2));
          });
      },
    }),
    getAllLeagues: build.query<ILeague[], void>({
      query: () => "league/all",
      transformResponse,
    }),
  }),
});

export { api };
