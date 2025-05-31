import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API_URL } from "../constants/envs";
import { AuthDTO } from "../api/DTO/common/auth.DTO";
import { TExtractData } from "../interfaces/utility.interface";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_API_URL}/auth` }),
  tagTypes: ["TELEGRAM"],
  endpoints: (build) => ({
    authByTelegram: build.query<
      TExtractData<AuthDTO>,
      { tgId?: number; username?: string }
    >({
      query: (body) => ({
        url: "tg",
        method: "POST",
        body,
      }),
      transformResponse: (baseQueryReturnValue: AuthDTO) =>
        baseQueryReturnValue.data,
      providesTags: (_result, _error, arg) => {
        const id = arg.tgId;

        return id ? [{ type: "TELEGRAM", id }] : [];
      },
    }),
  }),
});

export { authApi };
