import {
  IParticipateRequest,
  IParticipateRequestApprovePayload,
} from "@way-to-bot/shared/interfaces/participate-request.interface";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "@way-to-bot/shared/constants/envs";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";

const participateRequestsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_API_URL}/participateRequest`,
  }),
  endpoints: (build) => ({
    getAllParticipateRequests: build.query<IParticipateRequest[], void>({
      query: () => "all",
      transformResponse: (response: IResponseWithData<IParticipateRequest[]>) =>
        response.data,
    }),
    approveParticipateRequest: build.mutation({
      query: (payload: IParticipateRequestApprovePayload) => ({
        url: "approve",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export { participateRequestsApi };
