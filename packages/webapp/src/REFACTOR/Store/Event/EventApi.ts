import {webAppClientApi} from "../WebAppClientApi";
import {
    ClientDTOEventGetMany,
    ClientDTOEventGetManyResponse,
    ClientDTOEventGetOne,
    ClientDTOEventGetOneResponse
} from "@way-to-bot/shared/api/DTO/client/event.DTO";

const eventApi = webAppClientApi.injectEndpoints({
    endpoints: (build) => ({
        getAllEvents: build.query<ClientDTOEventGetMany[], void>({
            query: () => "event",
            transformResponse: (response: ClientDTOEventGetManyResponse) => response.data,
            providesTags: () => [{type: 'EVENT', id: "ALL"}],
        }),
        getEventById: build.query<ClientDTOEventGetOne, string>({
            query: (id) => `event/${id}`,
            transformResponse: (response: ClientDTOEventGetOneResponse) => response.data,
            providesTags: (_result, _err, id) => [{type: 'EVENT', id}],
        }),
    }),
});

export {eventApi};
