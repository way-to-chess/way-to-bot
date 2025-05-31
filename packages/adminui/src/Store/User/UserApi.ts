import {adminApi} from "../AdminApi";
import {
    AdminDTOUserCreateResponse,
    AdminDTOUserDeleteResponse,
    AdminDTOUserGetMany,
    AdminDTOUserGetManyResponse,
    AdminDTOUserGetOne,
    AdminDTOUserGetOneResponse
} from "@way-to-bot/shared/api/DTO/admin/user.DTO";
import {TAdminUserCreatePayload} from "@way-to-bot/shared/api/zod/admin/user.schema";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {IQueryOptions} from "@way-to-bot/shared/interfaces/query.interface";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";

const userApi = adminApi.injectEndpoints({
    endpoints: (build) => ({
        getAllUsers: build.query<AdminDTOUserGetMany[], IQueryOptions>({
            query: (options) => options ? getUrlWithSearchParams("user", options) : "user",
            transformResponse: (data: AdminDTOUserGetManyResponse) => data.data,
            providesTags: () => [{type: "USER", id: "ALL"}]
        }),
        getUserById: build.query<AdminDTOUserGetOne, string>({
            query: (id) => `user/${id}`,
            transformResponse: (data: AdminDTOUserGetOneResponse) => data.data,
            providesTags: (result, error, id) => [{type: "USER", id}],
        }),
        createUser: build.mutation<AdminDTOUserCreateResponse, TAdminUserCreatePayload>({
            query: (payload) => ({
                url: "user",
                method: "POST",
                body: payload,
            }),
        }),
        deleteUser: build.mutation<AdminDTOUserDeleteResponse, IWithId>({
            query: (payload) => ({
                url: "user",
                method: "DELETE",
                body: payload,
            }),
        }),
    })
})

export {userApi}