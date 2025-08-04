import {IDomain} from "../Domains";
import {AdminDTOLocationGetMany, AdminDTOLocationGetOne} from "@way-to-bot/shared/api/DTO/admin/location.DTO";
import {ImageIcon} from "lucide-react";
import {Avatar} from "antd";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {ESortDirection} from "@way-to-bot/shared/api/enums/ESortDirection";

const LocationsDomain: IDomain<AdminDTOLocationGetMany, AdminDTOLocationGetOne, unknown, unknown> = {
    title: "Локации",
    path: "locations",
    url: "location",
    columns: [
        {
            title: "ID",
            dataIndex: "id",
            width: 50,
        },
        {
            title: <ImageIcon size={18}/>,
            className: "iconCenter",
            align: "center",
            width: 30,
            render: (_, {preview}) => <Avatar shape={"square"} src={getPreviewSrc(preview?.previewUrl)}/>
        },
        {
            title: "Название",
            dataIndex: "title",
        },
        {
            title: "Адрес",
            dataIndex: "address",
        },
    ],
    options: {
        sort: {
            field: "createdAt",
            direction: ESortDirection.ASC
        }
    },
    create: {
        title: "Создать локацию",
        definition: null,
    },
    searchFields: ["title", "address"],
    edit: {
        title: "Изменить локацию",
        definition: null,
        getInitialValues: ({title, url, address, benefits, fileId}) => ({
            title,
            url,
            address,
            benefits,
            fileId,
        }),
    }
}

export {LocationsDomain}