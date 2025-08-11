import {IDomain} from "../Domains";
import {
    AdminDTOParticipateRequestGetMany,
    AdminDTOParticipateRequestGetOne
} from "@way-to-bot/shared/api/DTO/admin/participate-request.DTO";
import {COLUMNS} from "./Columns";
import {EditParticipateRequest} from "./Edit";
import {EXPANDABLE_CONFIG} from "./Expandable";
import {ESortDirection} from "@way-to-bot/shared/api/enums/ESortDirection";
import {EParticipateRequestStatus} from "@way-to-bot/shared/api/enums/EParticipateRequestStatus";

const ParticipateRequestsDomain: IDomain<AdminDTOParticipateRequestGetMany, AdminDTOParticipateRequestGetOne, unknown, unknown> = {
    title: "Запросы",
    path: "participate-requests",
    url: "participate-request",
    columns: COLUMNS,
    expandable: EXPANDABLE_CONFIG,
    options: {
        sort: {
            field: "createdAt",
            direction: ESortDirection.DESC,
        },
    },
    create: {
        title: "Создать запрос",
        definition: null,
    },
    searchFields: [],
    edit: {
        title: "Изменить запрос",
        definition: <EditParticipateRequest/>,
        getInitialValues: ({message}) => ({
            status: EParticipateRequestStatus.APPROVED,
            message,
            notify: true
        }),
    }
}

export {ParticipateRequestsDomain}