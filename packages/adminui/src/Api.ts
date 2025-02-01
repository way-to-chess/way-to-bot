import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "@way-to-bot/shared/constants/envs";
import {
  IParticipateRequest,
  IParticipateRequestApprovePayload,
} from "@way-to-bot/shared/interfaces/participate-request.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";
import { message } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { MutationDefinition } from "@reduxjs/toolkit/query";

const showMessagesAfterResponse: MutationDefinition<
  unknown,
  BaseQueryFn,
  string,
  unknown
>["onQueryStarted"] = (_, { queryFulfilled }) => {
  queryFulfilled
    .then(() => {
      message.success(TEXT.success);
    })
    .catch((response) => {
      message.error(JSON.stringify(response.error.data, null, 2));
    });
};

const API = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
  }),
  endpoints: (build) => ({
    getAllParticipateRequests: build.query<IParticipateRequest[], void>({
      query: () => "participateRequest/all",
      transformResponse: (response: IResponseWithData<IParticipateRequest[]>) =>
        response.data,
    }),
    approveParticipateRequest: build.mutation({
      query: (payload: IParticipateRequestApprovePayload) => ({
        url: "participateRequest/approve",
        method: "POST",
        body: payload,
      }),
      onQueryStarted: showMessagesAfterResponse,
    }),
  }),
});

export { API };
