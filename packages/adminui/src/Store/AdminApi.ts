import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_API_URL} from "@way-to-bot/shared/constants/envs";

const TAG_TYPES = [
    "user",
    "league",
    "participate-request",
    "event",
    "location",
] as const;

const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_API_URL}/admin`,
        prepareHeaders: (headers, {getState}) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", token);
            }

            return headers;
        },
    }),
    tagTypes: TAG_TYPES,
    endpoints: () => ({}),
});

export {adminApi, TAG_TYPES};
