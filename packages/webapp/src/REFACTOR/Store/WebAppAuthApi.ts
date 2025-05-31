import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_API_URL} from "@way-to-bot/shared/constants/envs";
import {AuthDTO} from "@way-to-bot/shared/api/DTO/common/auth.DTO";
import {TExtractData} from "@way-to-bot/shared/interfaces/utility.interface";

const webAppAuthApi = createApi({
    reducerPath: "webAppAuthApi",
    baseQuery: fetchBaseQuery({baseUrl: `${BASE_API_URL}/auth`}),
    tagTypes: ["TELEGRAM"],
    endpoints: (build) => ({
        authByTelegram: build.query<TExtractData<AuthDTO>, void>({
            query: () => ({
                url: "tg",
                method: "POST",
                body: {
                    tgId: Telegram.WebApp.initDataUnsafe.user?.id,
                    username: Telegram.WebApp.initDataUnsafe.user?.username,
                }
            }),
            transformResponse:
                (baseQueryReturnValue: AuthDTO) =>
                    baseQueryReturnValue.data,
            providesTags: () => {
                const id = Telegram.WebApp.initDataUnsafe.user?.id

                return id ? [{type: "TELEGRAM", id}] : []
            }
        })
    }),
});

export {webAppAuthApi};
