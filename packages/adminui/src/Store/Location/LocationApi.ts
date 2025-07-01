import { adminApi } from "../AdminApi";
import {
  AdminDTOLocationCreateResponse,
  AdminDTOLocationGetManyResponse,
} from "@way-to-bot/shared/api/DTO/admin/location.DTO";
import { TAdminLocationCreatePayload } from "@way-to-bot/shared/api/zod/admin/location.schema";
import { createEndpointFactory, getManyEndpointFactory } from "../Factories";

const locationApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAllLocations: getManyEndpointFactory<AdminDTOLocationGetManyResponse>(
      build,
      "location",
    ),
    createLocation: createEndpointFactory<
      AdminDTOLocationCreateResponse,
      TAdminLocationCreatePayload
    >(build, "location"),
  }),
});

export { locationApi };
