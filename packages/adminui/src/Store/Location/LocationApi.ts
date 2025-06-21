import {adminApi} from "../AdminApi";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {
    AdminDTOLocationCreateResponse,
    AdminDTOLocationGetManyResponse
} from "@way-to-bot/shared/api/DTO/admin/location.DTO";
import {TAdminLocationCreatePayload} from "@way-to-bot/shared/api/zod/admin/location.schema";


const locationApi = adminApi.injectEndpoints({
    endpoints: (build) => ({
        getAllLocations: build.query<AdminDTOLocationGetManyResponse, TCommonGetManyOptions>({
            query: (options) => options ? getUrlWithSearchParams("location", options) : "location",
            providesTags: () => [{type: "LOCATION", id: "ALL"}]
        }),
        createLocation: build.mutation<AdminDTOLocationCreateResponse, TAdminLocationCreatePayload>({
            query: (payload) => ({
                url: "location",
                method: "POST",
                body: payload
            }),
            invalidatesTags: [{type: "LOCATION", id: "ALL"}]
        }),
    })
})

export {locationApi}