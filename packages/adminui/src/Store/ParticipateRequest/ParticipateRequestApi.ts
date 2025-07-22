import { adminApi } from "../AdminApi";
import {
  AdminDTOParticipateRequestGetManyResponse,
  AdminDTOParticipateRequestUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/participate-request.DTO";
import { TAdminParticipateRequestUpdatePayload } from "@way-to-bot/shared/api/zod/admin/participate-request.schema";
import { IWithId } from "@way-to-bot/shared/interfaces/with.interface";
import { getManyEndpointFactory, updateEndpointFactory } from "../Factories";

const participateRequestApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAllParticipateRequests:
      getManyEndpointFactory<AdminDTOParticipateRequestGetManyResponse>(
        build,
        "participate-request",
      ),
    updateParticipateRequest: updateEndpointFactory<
      AdminDTOParticipateRequestUpdateResponse,
      TAdminParticipateRequestUpdatePayload & IWithId
    >(build, "participate-request"),
  }),
});

export { participateRequestApi };
