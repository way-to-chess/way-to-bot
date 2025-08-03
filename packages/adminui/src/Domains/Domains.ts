import {ComponentType, ReactNode} from "react";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {EventsDomain} from "./Events/Domain";
import {TableProps} from "antd";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {LeaguesDomain} from "./Leagues/Domain";
import {LocationsDomain} from "./Locations/Domain";
import {UsersDomain} from "./Users/Domain";
import {ParticipateRequestsDomain} from "./ParticipateRequests/Domain";
import {MessagesDomain} from "./Messages/Domain";

interface IDomain<GetMany = IWithId, GetOne = IWithId, CreatePayload = unknown, UpdatePayload = unknown> {
    title: string;
    path: string;
    url: string;
    columns: TableProps<GetMany>["columns"];
    options: TCommonGetManyOptions;
    Component?: ComponentType;
    searchFields: string[];
    expandable?: TableProps<GetMany>["expandable"];
    actions?: ((it: GetMany) => ReactNode)[];
    create: {
        title: string
        url?: string
        definition: ReactNode,
        initialValues?: Record<string, unknown>,
        normalize?: (values: any) => CreatePayload
    },
    edit: {
        title: string
        definition: ReactNode,
        getInitialValues: (it: GetOne) => Record<string, unknown>,
        normalize?: (values: any) => UpdatePayload
    }
}

const Domains = [
    UsersDomain,
    EventsDomain,
    LeaguesDomain,
    ParticipateRequestsDomain,
    MessagesDomain,
    LocationsDomain
] as const;

export {Domains};
export type {IDomain};
