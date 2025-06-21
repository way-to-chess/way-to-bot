import {adminApi} from "../AdminApi";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {AdminDTOEventCreateResponse, AdminDTOEventGetManyResponse} from "@way-to-bot/shared/api/DTO/admin/event.DTO";
import {TAdminEventCreatePayload} from "@way-to-bot/shared/api/zod/admin/event.schema";


const eventApi = adminApi.injectEndpoints({
    endpoints: (build) => ({
        getAllEvents: build.query<AdminDTOEventGetManyResponse, TCommonGetManyOptions>({
            query: (options) => options ? getUrlWithSearchParams("event", options) : "event",
            providesTags: () => [{type: "EVENT", id: "ALL"}]
        }),
        createEvent: build.mutation<AdminDTOEventCreateResponse, TAdminEventCreatePayload>({
            query: (payload) => ({
                url: "event",
                method: "POST",
                body: payload
            }),
            invalidatesTags: [{type: "EVENT", id: "ALL"}]
        }),
    })
})

export {eventApi}