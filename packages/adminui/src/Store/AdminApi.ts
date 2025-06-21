import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_API_URL} from "@way-to-bot/shared/constants/envs";
import {authSlice, IWithAuthState} from "@way-to-bot/shared/redux/authSlice";

const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_API_URL}/admin`,
        prepareHeaders: (headers, {getState}) => {
            const token = authSlice.selectors.token(getState() as IWithAuthState)

            if (token) {
                headers.set("Authorization", token)
            }

            return headers
        }
    }),
    tagTypes: ["USER", "LEAGUE", "PARTICIPATE_REQUEST", "EVENT", "LOCATION"],
    endpoints: () => ({})
});

export {adminApi};
