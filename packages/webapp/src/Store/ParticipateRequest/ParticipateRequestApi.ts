import {clientApi} from "../ClientApi";
import {TClientParticipateRequestCreatePayload} from "@way-to-bot/shared/api/zod/client/participate-request.schema";
import {
    ClientDTOParticipateRequestCreateResponse,
    ClientDTOParticipateRequestGetMany,
    ClientDTOParticipateRequestGetManyResponse
} from "@way-to-bot/shared/api/DTO/client/participate-request.DTO";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";

const participateRequestApi = clientApi.injectEndpoints({
    endpoints: (build) => ({
        getAllParticipateRequests: build.query<ClientDTOParticipateRequestGetMany[], TCommonGetManyOptions | void>({
            query: (options) => options ? getUrlWithSearchParams("participate-request", options) : "participate-request",
            transformResponse: (data: ClientDTOParticipateRequestGetManyResponse) => data.data,
            providesTags: () => [{type: "PARTICIPATE_REQUEST", id: "ALL"}],
            extraOptions: {
                authorized: true
            }
        }),
        createParticipateRequest: build.mutation<ClientDTOParticipateRequestCreateResponse, TClientParticipateRequestCreatePayload>({
            query: (payload) => ({
                url: "participate-request",
                body: payload,
                method: "POST"
            }),
            extraOptions: {
                authorized: true
            }
        }),
    })
})

export {participateRequestApi}