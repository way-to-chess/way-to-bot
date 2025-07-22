import { adminApi } from "../AdminApi";
import { TAdminTgSendCustomMessagePayload } from "@way-to-bot/shared/api/zod/admin/tg.schema";

const TGApi = adminApi.injectEndpoints({
  endpoints: (build) => ({
    sendCustomMessage: build.mutation<void, TAdminTgSendCustomMessagePayload>({
      query: (payload) => ({
        url: "tg/message/custom",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export { TGApi };
