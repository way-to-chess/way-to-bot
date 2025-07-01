import { adminApi } from "../AdminApi";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {
  AdminDTOEventCreateResponse,
  AdminDTOEventDeleteResponse,
  AdminDTOEventGetManyResponse,
  AdminDTOEventGetOne,
  AdminDTOEventUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/event.DTO";
import {
  TAdminEventCreatePayload,
  TAdminEventUpdatePayload,
} from "@way-to-bot/shared/api/zod/admin/event.schema";
import {
  createEndpointFactory,
  deleteEndpointFactory,
  getManyEndpointFactory,
  getOneEndpointFactory,
  updateEndpointFactory,
} from "../Factories";

const eventApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: getManyEndpointFactory<AdminDTOEventGetManyResponse>(
      build,
      "event",
    ),
    getEventById: getOneEndpointFactory<AdminDTOEventGetOne>(build, "event"),
    createEvent: createEndpointFactory<
      AdminDTOEventCreateResponse,
      TAdminEventCreatePayload
    >(build, "event"),
    deleteEvent: deleteEndpointFactory<AdminDTOEventDeleteResponse>(
      build,
      "event",
    ),
    updateEvent: updateEndpointFactory<
      AdminDTOEventUpdateResponse,
      TAdminEventUpdatePayload
    >(build, "event"),
  }),
});

export { eventApi };
