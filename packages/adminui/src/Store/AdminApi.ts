import {createApi, fetchBaseQuery,} from "@reduxjs/toolkit/query/react";
import {BASE_API_URL} from "@way-to-bot/shared/constants/envs";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {GetManyWithPaginationDTO} from "@way-to-bot/shared/api/DTO/common/get-many-with-pagination.DTO";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {GetOneDTO} from "@way-to-bot/shared/api/DTO/common/get-one.DTO";

const TAG_TYPES: string[] = [
    "user",
    "league",
    "participate-request",
    "event",
    "location",
]

interface IGetManyPayload {
    url: string;
    options: TCommonGetManyOptions;
}

interface IGetOnePayload extends IWithId {
    url: string;
}

interface ICreatePayload {
    url: string;
    payload: unknown;
}

interface IDeletePayload extends IWithId {
    url: string;
}

interface IUpdatePayload extends IWithId {
    url: string;
    payload: unknown;
}

const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_API_URL}/admin`,
        prepareHeaders: (headers, {getState}) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", token);
            }

            return headers;
        },
    }),
    tagTypes: TAG_TYPES,
    endpoints: (build) => ({
        getMany: build.query<GetManyWithPaginationDTO<IWithId>, IGetManyPayload>({
            query: ({options, url}) =>
                options && Object.keys(options).length > 0 ? getUrlWithSearchParams(url, options) : url,
            providesTags: (result, error, arg, meta) => [{type: arg.url, id: "ALL"}]
        }),
        getOne: build.query<IWithId, IGetOnePayload>({
            query: ({id, url}) => `${url}/${id}`,
            transformResponse: (res: GetOneDTO<IWithId>) => res.data,
            providesTags: (result, error, arg) => [{type: arg.url, id: arg.id}],
        }),
        create: build.mutation<unknown, ICreatePayload>({
            query: ({url, payload}) => ({
                url,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: (result, error, arg) => [{type: arg.url, id: "ALL"}],
        }),
        delete: build.mutation<unknown, IDeletePayload>({
            query: ({id, url}) => ({
                url: `${url}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [{type: arg.url, id: "ALL"}],
        }),
        update: build.mutation<unknown, IUpdatePayload>({
            query: ({id, url, payload}) => ({
                url: `${url}/${id}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: (result, error, arg) => [{type: arg.url, id: "ALL"}],
        }),
    }),
});

export {adminApi, TAG_TYPES};
