import {
    ClientDTOUserCreateResponse,
    ClientDTOUserGetMany,
    ClientDTOUserGetManyResponse,
    ClientDTOUserGetOne,
    ClientDTOUserGetOneResponse
} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import {TClientUserCreatePayload} from "@way-to-bot/shared/api/zod/client/user.schema";
import {clientApi} from "../ClientApi";

const userApi = clientApi.injectEndpoints({
    endpoints: (build) => ({
        getAllUsers: build.query<ClientDTOUserGetMany[], void>({
            query: () => "user",
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
    }),
});

export {userApi};
