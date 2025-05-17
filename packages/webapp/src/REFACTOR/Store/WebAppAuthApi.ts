import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_API_URL} from "@way-to-bot/shared/constants/envs";
import {IResponseWithData} from "@way-to-bot/shared/interfaces/response.interface";

const webAppAuthApi = createApi({
    reducerPath: "webAppAuthApi",
    baseQuery: fetchBaseQuery({baseUrl: `${BASE_API_URL}/auth`}),
    tagTypes: ["TELEGRAM"],
    endpoints: (build) => ({
        authByTelegram: build.query<{ id: number, token: string }, void>({
            query: () => ({
                url: "tg",
                method: "POST",
                body: {
                    tgId: Telegram.WebApp.initDataUnsafe.user?.id,
                    username: Telegram.WebApp.initDataUnsafe.user?.username,
                }
            }),
            transformResponse:
                (baseQueryReturnValue: IResponseWithData<{ id: number, token: string }>) =>
                    baseQueryReturnValue.data,
            providesTags: () => {
                const id = Telegram.WebApp.initDataUnsafe.user?.id

                return id ? [{type: "TELEGRAM", id}] : []
            }
        })
    }),
});

export {webAppAuthApi};
