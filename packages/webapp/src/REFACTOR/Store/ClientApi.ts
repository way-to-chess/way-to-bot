import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_API_URL} from "@way-to-bot/shared/constants/envs";

const clientApi = createApi({
    reducerPath: "webAppClientApi",
    baseQuery: fetchBaseQuery({baseUrl: `${BASE_API_URL}/client`}),
    tagTypes: ["EVENT", "USER"],
    endpoints: (build) => ({}),
});

export {clientApi};
