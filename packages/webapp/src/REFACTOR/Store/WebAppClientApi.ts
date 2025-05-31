import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_API_URL} from "@way-to-bot/shared/constants/envs";
import {RootState} from "./Store";
import {authSlice} from "./Auth/AuthSlice";

const webAppClientApi = createApi({
    reducerPath: "webAppClientApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_API_URL}/client`,
        prepareHeaders: (headers, api) => {
            const token = authSlice.selectors.token(api.getState() as RootState)
            if (token) {
                headers.set("Authorization", token)
            }

            return headers
        }
    }),
    tagTypes: ["EVENT", "USER", "TELEGRAM"],
    endpoints: () => ({}),
});

export {webAppClientApi};
