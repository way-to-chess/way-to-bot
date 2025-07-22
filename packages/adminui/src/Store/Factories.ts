import { getUrlWithSearchParams } from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import { IWithId } from "@way-to-bot/shared/interfaces/with.interface";
import { adminApi, TAG_TYPES } from "./AdminApi";
import { GetOneDTO } from "@way-to-bot/shared/api/DTO/common/get-one.DTO";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";

type TAdminBuild = Parameters<
  Parameters<(typeof adminApi)["injectEndpoints"]>[0]["endpoints"]
>[0];

type TName = (typeof TAG_TYPES)[number];

const getManyEndpointFactory = <Response>(build: TAdminBuild, name: TName) =>
  build.query<Response, TCommonGetManyOptions>({
    query: (options) =>
      options && Object.keys(options).length > 0
        ? getUrlWithSearchParams(name, options)
        : name,
    providesTags: () => [{ type: name, id: "ALL" }],
  });

const getOneEndpointFactory = <Response>(build: TAdminBuild, name: TName) =>
  build.query<Response, IWithId>({
    query: ({ id }) => `${name}/${id}`,
    transformResponse: (res: GetOneDTO<Response>) => res.data,
    providesTags: (result, error, arg) => [{ type: name, id: arg.id }],
  });

const createEndpointFactory = <Response, Payload>(
  build: TAdminBuild,
  name: TName,
) =>
  build.mutation<Response, Payload>({
    query: (payload) => ({
      url: name,
      method: "POST",
      body: payload,
    }),
    invalidatesTags: [{ type: name, id: "ALL" }],
  });

const deleteEndpointFactory = <Response>(build: TAdminBuild, name: TName) =>
  build.mutation<Response, IWithId>({
    query: ({ id }) => ({
      url: `${name}/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: [{ type: name, id: "ALL" }],
  });

const updateEndpointFactory = <Response, Payload>(
  build: TAdminBuild,
  name: TName,
) =>
  build.mutation<Response, Payload & IWithId>({
    query: ({ id, ...rest }) => ({
      url: `${name}/${id}`,
      method: "PATCH",
      body: rest,
    }),
    invalidatesTags: [{ type: name, id: "ALL" }],
  });

export {
  getManyEndpointFactory,
  getOneEndpointFactory,
  createEndpointFactory,
  deleteEndpointFactory,
  updateEndpointFactory,
};
