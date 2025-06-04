import {adminApi} from "../AdminApi";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {
    AdminDTOLeagueCreateResponse,
    AdminDTOLeagueDeleteResponse,
    AdminDTOLeagueGetManyResponse,
    AdminDTOLeagueGetOne,
    AdminDTOLeagueGetOneResponse
} from "@way-to-bot/shared/api/DTO/admin/league.DTO";
import {TAdminLeagueCreatePayload} from "@way-to-bot/shared/api/zod/admin/league.schema";

const leagueApi = adminApi.injectEndpoints({
    endpoints: (build) => ({
        getAllLeagues: build.query<AdminDTOLeagueGetManyResponse, TCommonGetManyOptions>({
            query: (options) => options ? getUrlWithSearchParams("league", options) : "league",
            providesTags: () => [{type: "LEAGUE", id: "ALL"}]
        }),
        getLeagueById: build.query<AdminDTOLeagueGetOne, string>({
            query: (id) => `league/${id}`,
            transformResponse: (data: AdminDTOLeagueGetOneResponse) => data.data,
            providesTags: (_, __, id) => [{type: "LEAGUE", id}],
        }),
        createLeague: build.mutation<AdminDTOLeagueCreateResponse, TAdminLeagueCreatePayload>({
            query: (payload) => ({
                url: "league",
                method: "POST",
                body: payload,
            }),
        }),
        deleteLeague: build.mutation<AdminDTOLeagueDeleteResponse, IWithId>({
            query: (payload) => ({
                url: `league/${payload.id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "LEAGUE", id: "ALL"}]
        }),
    })
})

export {leagueApi}