import {IDomain} from "../Domains";
import {UploadFile} from "antd";
import {BaseForm, IFormValues} from "./BaseForm";
import {EEventStatus} from "@way-to-bot/shared/api/enums/EEventStatus";
import {AdminDTOEventGetMany, AdminDTOEventGetOne} from "@way-to-bot/shared/api/DTO/admin/event.DTO";
import dayjs from "dayjs";
import {IFileEntity} from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {TAdminEventCreatePayload, TAdminEventUpdatePayload} from "@way-to-bot/shared/api/zod/admin/event.schema";
import {SubmitResults} from "./SubmitResults";
import {ESortDirection} from "@way-to-bot/shared/api/enums/ESortDirection";
import {AddLeagueToEvent} from "./AddLeagueToEvent";
import {EEventType} from "@way-to-bot/shared/api/enums/EEventType";

const convertFileToFileList = (file: IFileEntity) => {
    return [
        {
            uid: String(file.id),
            name: file.url ? String(file.url.split("/").at(-2)) : "",
            status: "done" as const,
            url: getPreviewSrc(file.url),
            thumbUrl: getPreviewSrc(file.previewUrl),
        },
    ];
};

const getFileId = (file?: UploadFile) => {
    return file ? (file?.response?.data.id ?? Number(file.uid)) : null;
}

const EventsDomain: IDomain<
    AdminDTOEventGetMany, AdminDTOEventGetOne, TAdminEventCreatePayload, TAdminEventUpdatePayload
> = {
    title: "События",
    path: "events",
    url: "event",
    actions: [
        ({id}) => <SubmitResults id={id}/>,
        ({id}) => <AddLeagueToEvent id={id}/>,
    ],
    columns: [
        {
            title: "Название",
            dataIndex: "name",
        },
    ],
    options: {
        sort: {
            field: "createdAt",
            direction: ESortDirection.DESC,
        },
    },
    create: {
        title: "Создать событие",
        definition: <BaseForm/>,
        normalize: ({dateTime, file, participantsLimit, ...rest}: IFormValues) => ({
            fileId: getFileId(file[0]),
            dateTime: dateTime[0].toDate(),
            duration: dateTime[1] ? dateTime[1].diff(dateTime[0]) : null,
            participantsLimit: isNaN(Number(participantsLimit))
                ? 0
                : Number(participantsLimit),
            ...rest,
        }),
        initialValues: {status: EEventStatus.WAITING, type: EEventType.CHESS, city: "Минск", notify: true}
    },
    searchFields: ["name"],
    edit: {
        title: "Изменить событие",
        definition: <BaseForm isEdit/>,
        getInitialValues: (
            {
                participantsLimit,
                name,
                dateTime,
                duration,
                price,
                status,
                location,
                description,
                host,
                linkToStream,
                preview,
                type,
                city
            }) => ({
            file: preview ? convertFileToFileList(preview) : [],
            participantsLimit,
            name,
            dateTime: [
                dayjs(dateTime),
                duration ? dayjs(dateTime).add(duration, "milliseconds") : null,
            ],
            price,
            status,
            locationId: location?.id,
            description,
            hostId: host?.id,
            linkToStream,
            type,
            city
        }),
        normalize: ({dateTime, file, participantsLimit, ...rest}: Omit<IFormValues, "notify">) => ({
            fileId: getFileId(file[0]),
            duration: dateTime[1] ? dateTime[1].diff(dateTime[0]) : null,
            participantsLimit: isNaN(Number(participantsLimit))
                ? 0
                : Number(participantsLimit),
            ...rest,
        })
    }
}

export {EventsDomain}