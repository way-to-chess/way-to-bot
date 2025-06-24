import {
    ClientDTOEventGetMany,
    ClientDTOEventGetManyResponse,
    ClientDTOEventGetOne,
    ClientDTOEventGetOneResponse
} from "@way-to-bot/shared/api/DTO/client/event.DTO";
import {clientApi} from "../ClientApi";
import {IUserEntity} from "@way-to-bot/shared/api/interfaces/entities/user-entity.interface";
import {getUrlWithSearchParams} from "@way-to-bot/shared/utils/GetUrlWithSearchParams";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";

interface Event extends Omit<ClientDTOEventGetOne, "mapEventLeagues"> {
    users: IUserEntity[]
}

const eventApi = clientApi.injectEndpoints({
    endpoints: (build) => ({
        getAllEvents: build.query<ClientDTOEventGetMany[], TCommonGetManyOptions>({
            query: (options) => options ? getUrlWithSearchParams("event", options) : "event",
            transformResponse: (response: ClientDTOEventGetManyResponse) => response.data,
            providesTags: () => [{type: 'EVENT', id: "ALL"}],
        }),
        getEventById: build.query<Event, string>({
            query: (id) => `event/${id}`,
            transformResponse: (response: ClientDTOEventGetOneResponse) => {
                return {
                    ...response.data,
                    users: response.data.eventLeagues.reduce<IUserEntity[]>((acc, it) => {
                        acc.push(...it.participants)

                        return acc
                    }, [])
                }
            },
            providesTags: (_result, _err, id) => [{type: 'EVENT', id}],
        }),
    }),
});

export {eventApi};
