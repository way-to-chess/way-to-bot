import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_API_URL} from "@way-to-bot/shared/constants/envs";

const webAppApi = createApi({
    reducerPath: "webAppApi",
    baseQuery: fetchBaseQuery({baseUrl: BASE_API_URL}),
    tagTypes: ["EVENT", "USER"],
    endpoints: () => ({}),
});

export {webAppApi};
