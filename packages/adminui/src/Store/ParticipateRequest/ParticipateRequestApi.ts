import {adminApi} from "../AdminApi";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {
    AdminDTOParticipateRequestGetManyResponse,
    AdminDTOParticipateRequestUpdateResponse
} from "@way-to-bot/shared/api/DTO/admin/participate-request.DTO";

const participateRequestApi = adminApi.injectEndpoints({
    endpoints: (build) => ({
        getAllParticipateRequests: build.query<AdminDTOParticipateRequestGetManyResponse, TCommonGetManyOptions>({
            query: (options) => options ? getUrlWithSearchParams("participate-request", options) : "participate-request",
            providesTags: () => [{type: "PARTICIPATE_REQUEST", id: "ALL"}]
        }),
        approveParticipateRequest: build.mutation<AdminDTOParticipateRequestUpdateResponse, IWithId>({
            query: (payload) => ({
                url: `participate-request/${payload.id}`,
                method: "PATCH",
            }),
            invalidatesTags: [{type: "PARTICIPATE_REQUEST", id: "ALL"}]
        }),
    })
})

export {participateRequestApi}