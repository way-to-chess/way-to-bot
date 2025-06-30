import { adminApi } from "../AdminApi";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { getUrlWithSearchParams } from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {
  AdminDTOParticipateRequestGetManyResponse,
  AdminDTOParticipateRequestUpdateResponse,
} from "@way-to-bot/shared/api/DTO/admin/participate-request.DTO";
import { TAdminParticipateRequestUpdatePayload } from "@way-to-bot/shared/api/zod/admin/participate-request.schema";
import { IWithId } from "@way-to-bot/shared/interfaces/with.interface";

const participateRequestApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    getAllParticipateRequests: build.query<
      AdminDTOParticipateRequestGetManyResponse,
      TCommonGetManyOptions
    >({
      query: (options) =>
        options
          ? getUrlWithSearchParams("participate-request", options)
          : "participate-request",
      providesTags: () => [{ type: "PARTICIPATE_REQUEST", id: "ALL" }],
    }),
    updateParticipateRequest: build.mutation<
      AdminDTOParticipateRequestUpdateResponse,
      TAdminParticipateRequestUpdatePayload & IWithId
    >({
      query: ({ id, ...payload }) => ({
        url: `participate-request/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [{ type: "PARTICIPATE_REQUEST", id: "ALL" }],
    }),
  }),
});

export { participateRequestApi };
