import {IDomain} from "../Domains";
import {AdminDTOUserGetMany, AdminDTOUserGetOne} from "@way-to-bot/shared/api/DTO/admin/user.DTO";
import {TAdminUserCreatePayload, TAdminUserUpdatePayload} from "@way-to-bot/shared/api/zod/admin/user.schema";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {Avatar, Flex, Tag, Typography} from "antd";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {EUserRole} from "@way-to-bot/shared/api/enums/EUserRole";

const UsersDomain: IDomain<AdminDTOUserGetMany, AdminDTOUserGetOne, TAdminUserCreatePayload, TAdminUserUpdatePayload> = {
    title: "Пользователи",
    path: "users",
    url: "user",
    columns: [
        {
            title: "ID",
            dataIndex: "id",
            width: 50,
            sorter: true,
        },
        {
            title: "Фото",
            render: (_, {photo}) => (
                <Avatar
                    src={photo?.previewUrl ? getPreviewSrc(photo.previewUrl) : undefined}
                />
            ),
            width: 50,
        },

        {
            title: "Имя",
            render: (_, {firstName, lastName, username}) => (
                <Flex vertical>
                    <Typography.Text>
                        {getUserFullName(firstName, lastName)}
                    </Typography.Text>
                    <Typography.Text type={"secondary"}>{username ?? "-"}</Typography.Text>
                </Flex>
            ),
        },
        {
            dataIndex: "rating",
            title: "Рейтинг",
            sorter: true,
        },
        {
            title: "Кол. Игр",
            dataIndex: "total",
            sorter: true,
        },
        {
            title: "% Побед",
            dataIndex: "winRate",
            sorter: true,
        },
        {
            title: "Роли",
            render: (_, {roles}) => {
                return roles.map((role) => {
                    return (
                        <Tag color={role === EUserRole.ADMIN ? "geekblue" : "green"}>
                            {role}
                        </Tag>
                    );
                });
            },
        },
    ],
    options: {},
    create: {
        title: "Создать пользователя",
        definition: null,
    },
    searchFields: ["firstName", "lastName", "username"],
    edit: {
        title: "Изменить пользователя",
        definition: null,
        getInitialValues: ({firstName, lastName, username}) => ({
            firstName,
            lastName,
            username,
        }),
    }
}

export {UsersDomain}
