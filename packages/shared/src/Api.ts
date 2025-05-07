// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { IResponseWithData } from "./interfaces/response.interface";
//
// const transformResponse = <Data>(response: IResponseWithData<Data>) =>
//   response.data;
//
// const api = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: BASE_API_URL,
//   }),
//   endpoints: (build) => ({
//     getAllParticipateRequests: build.query<IParticipateRequest[], void>({
//       query: () => "participateRequest/all",
//       transformResponse,
//     }),
//     approveParticipateRequest: build.mutation({
//       query: (payload: IParticipateRequestApprovePayload) => ({
//         url: "participateRequest/approve",
//         method: "POST",
//         body: payload,
//       }),
//       transformResponse,
//     }),
//     getAllLeagues: build.query<ILeague[], void>({
//       query: () => "league/all",
//       transformResponse,
//     }),
//   }),
// });
//
// export { api };
