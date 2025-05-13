import {webAppApi} from "../WebAppApi";
import {
    ClientDTOEventGetMany,
    ClientDTOEventGetManyResponse,
    ClientDTOEventGetOne,
    ClientDTOEventGetOneResponse
} from "@way-to-bot/shared/api/DTO/client/event.DTO";

const eventApi = webAppApi.injectEndpoints({
    endpoints: (build) => ({
        getAllEvents: build.query<ClientDTOEventGetMany[], void>({
            query: () => "event",
            transformResponse: (response: ClientDTOEventGetManyResponse) => response.data,
        }),
        getEventById: build.query<ClientDTOEventGetOne, string>({
            query: (id) => `event/${id}`,
            transformResponse: (response: ClientDTOEventGetOneResponse) => response.data,
        }),
    }),
});

export {eventApi};
