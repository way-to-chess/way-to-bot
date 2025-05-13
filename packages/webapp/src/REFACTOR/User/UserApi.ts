import {webAppApi} from "../WebAppApi";
import {
    ClientDTOUserCreateResponse,
    ClientDTOUserGetMany,
    ClientDTOUserGetManyResponse
} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import {TClientUserCreatePayload} from "@way-to-bot/shared/api/zod/client/user.schema";

const userApi = webAppApi.injectEndpoints({
    endpoints: (build) => ({
        getAllUsers: build.query<ClientDTOUserGetMany[], void>({
            query: () => "user",
            transformResponse: (data: ClientDTOUserGetManyResponse) => data.data,
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
