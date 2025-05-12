import {ClientDTOEventGetOne} from "@way-to-bot/shared/api/DTO/client/event.DTO";
import {TDate} from "@way-to-bot/shared/interfaces/date.inteface";

interface IEvent extends Omit<ClientDTOEventGetOne, "dateTime"> {
    dateTime: TDate
}

export type {IEvent}