import {ComponentType} from "react";
import {UsersTable} from "./Users/Table";
import {EventsTable} from "./Events/Table";
import {ParticipateRequestsTable} from "./ParticipateRequests/Table";
import {MessagesTable} from "./Messages/Table";
import {LocationsTable} from "./Locations/Table";

interface IDomain {
    title: string;
    path: string;
    Component: ComponentType;
}

const Domains: IDomain[] = [
    {
        title: "Пользователи",
        path: "users",
        Component: UsersTable,
    },
    {
        title: "События",
        path: "events",
        Component: EventsTable,
    },
    {
        title: "Запросы",
        path: "participate-requests",
        Component: ParticipateRequestsTable,
    },
    {
        title: "Сообщения",
        path: "messages",
        Component: MessagesTable,
    },
    {
        title: "Локации",
        path: "locations",
        Component: LocationsTable
    }
];

export {Domains};
export type {IDomain};
