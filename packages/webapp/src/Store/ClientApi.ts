import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_API_URL} from "@way-to-bot/shared/constants/envs";
import {authSlice, IWithAuthState} from "@way-to-bot/shared/redux/authSlice";

const clientApi = createApi({
    reducerPath: "webAppClientApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_API_URL}/client`,
        prepareHeaders: (headers, {getState, extraOptions}) => {
            if (extraOptions && Object.hasOwn(extraOptions, "authorized")) {
                const token = authSlice.selectors.token(getState() as IWithAuthState)

                if (token) {
                    headers.set("Authorization", token)
                }
            }

            return headers
        }
    }),

    tagTypes: ["EVENT", "USER", "PARTICIPATE_REQUEST"],
    endpoints: (build) => ({}),
});

export {clientApi};
