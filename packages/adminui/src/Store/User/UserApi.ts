import {adminApi} from "../AdminApi";
import {
    AdminDTOUserCreateResponse,
    AdminDTOUserDeleteResponse,
    AdminDTOUserGetManyResponse,
    AdminDTOUserGetOne,
    AdminDTOUserGetOneResponse
} from "@way-to-bot/shared/api/DTO/admin/user.DTO";
import {TAdminUserCreatePayload} from "@way-to-bot/shared/api/zod/admin/user.schema";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";

const userApi = adminApi.injectEndpoints({
    endpoints: (build) => ({
        getAllUsers: build.query<AdminDTOUserGetManyResponse, TCommonGetManyOptions>({
            query: (options) => options ? getUrlWithSearchParams("user", options) : "user",
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
                url: `user/${payload.id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "USER", id: "ALL"}]
        }),
    })
})

export {userApi}