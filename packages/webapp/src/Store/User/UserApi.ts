import {
    ClientDTOUserCreateResponse,
    ClientDTOUserGetMany,
    ClientDTOUserGetManyResponse,
    ClientDTOUserGetOne,
    ClientDTOUserGetOneResponse,
    ClientDTOUserUpdateResponse
} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import {TClientUserCreatePayload, TClientUserUpdatePayload} from "@way-to-bot/shared/api/zod/client/user.schema";
import {clientApi} from "../ClientApi";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";

const userApi = clientApi.injectEndpoints({
    endpoints: (build) => ({
        getAllUsers: build.query<ClientDTOUserGetMany[], TCommonGetManyOptions>({
            query: (options) => options ? getUrlWithSearchParams("user", options) : "user",
            transformResponse: (data: ClientDTOUserGetManyResponse) => data.data,
            providesTags: () => [{type: "USER", id: "ALL"}]
        }),
        getUserById: build.query<ClientDTOUserGetOne, string>({
            query: (id) => `user/${id}`,
            transformResponse: (data: ClientDTOUserGetOneResponse) => data.data,
            providesTags: (result, error, id) => [{type: "USER", id}],
        }),
        createUser: build.mutation<ClientDTOUserCreateResponse, TClientUserCreatePayload>({
            query: (payload) => ({
                url: "user",
                method: "POST",
                body: payload,
            }),
        }),
        updateUser: build.mutation<ClientDTOUserUpdateResponse, TClientUserUpdatePayload & IWithId>({
            query: ({id, ...payload}) => ({
                url: `user/${id}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: (_, __, {id}) => [{type: "USER", id}],
            extraOptions: {
                authorized: true
            }
        }),
    }),
});

export {userApi};
