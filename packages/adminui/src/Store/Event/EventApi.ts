import {adminApi} from "../AdminApi";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {
    AdminDTOEventCreateResponse,
    AdminDTOEventDeleteResponse,
    AdminDTOEventGetManyResponse,
    AdminDTOEventUpdateResponse
} from "@way-to-bot/shared/api/DTO/admin/event.DTO";
import {TAdminEventCreatePayload, TAdminEventUpdatePayload} from "@way-to-bot/shared/api/zod/admin/event.schema";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";


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
        deleteEvent: build.mutation<AdminDTOEventDeleteResponse, IWithId>({
            query: ({id}) => ({
                url: `event/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{type: "EVENT", id: "ALL"}]
        }),
        updateEvent: build.mutation<AdminDTOEventUpdateResponse, TAdminEventUpdatePayload & IWithId>({
            query: ({id, ...rest}) => ({
                url: `event/${id}`,
                method: "PATCH",
                body: rest
            }),
            invalidatesTags: [{type: "EVENT", id: "ALL"}]
        }),
    })
})

export {eventApi}