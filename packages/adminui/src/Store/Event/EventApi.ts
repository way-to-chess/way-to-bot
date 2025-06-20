import {adminApi} from "../AdminApi";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {AdminDTOEventGetManyResponse, AdminDTOEventUpdateResponse} from "@way-to-bot/shared/api/DTO/admin/event.DTO";


const eventApi = adminApi.injectEndpoints({
    endpoints: (build) => ({
        getAllEvents: build.query<AdminDTOEventGetManyResponse, TCommonGetManyOptions>({
            query: (options) => options ? getUrlWithSearchParams("event", options) : "event",
            providesTags: () => [{type: "EVENT", id: "ALL"}]
        }),
        approveEvent: build.mutation<AdminDTOEventUpdateResponse, IWithId>({
            query: (payload) => ({
                url: `event/${payload.id}`,
                method: "PATCH",
            }),
            invalidatesTags: [{type: "EVENT", id: "ALL"}]
        }),
    })
})

export {eventApi}