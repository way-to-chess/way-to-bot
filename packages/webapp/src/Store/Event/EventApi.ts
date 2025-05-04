import { webAppApi } from "../WebAppApi";
import { IEvent } from "@way-to-bot/shared/interfaces/event.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";

const eventApi = webAppApi.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query<IEvent[], void>({
      query: () => "event/all",
      transformResponse: (data: IResponseWithData<IEvent[]>) => data.data,
    }),
  }),
});

export { eventApi };
