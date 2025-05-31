import {Avatar, Button, Flex, Popconfirm, Table, TableProps, Tag, Typography} from "antd";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {ClientDTOUserGetMany} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import {userApi} from "../../Store/User/UserApi";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {ESortDirection, EUserRole} from "@way-to-bot/shared/api/enums/index";
import {FC} from "react";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";

const DeleteButton: FC<IWithId> = ({id}) => {
    const [trigger] = userApi.useDeleteUserMutation()

    const onConfirm = () => trigger({id})

    return <Popconfirm
        title={"Удалить?"}
        okText={"Да"}
        cancelText={"Нет"}
        onConfirm={onConfirm}
    >
        <Button danger type={"text"}>{"Удалить"}</Button>
    </Popconfirm>
}

const COLUMNS: TableProps<ClientDTOUserGetMany>["columns"] = [
    {
        title: "ID",
        render: (_, {id}) => id,
        width: 50
    },
    {
        title: "Фото",
        render: (_, {photo}) => <Avatar src={photo?.previewUrl ? getPreviewSrc(photo.previewUrl) : undefined}/>,
        width: 50
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
        title: "Рейтинг",
        render: (_, {rating}) => rating
    },
    {
        title: "Кол. Игр",
        render: (_, {total}) => total
    },
    {
        title: "% Побед",
        render: (_, {winRate}) => winRate
    },
    {
        title: "Роли",
        render: (_, {roles}) => {
            return roles.map((role) => {
                return <Tag color={role === EUserRole.ADMIN ? 'geekblue' : 'green'}>
                    {role}
                </Tag>
            })
        },
    },

    {
        title: "Действия",
        render: (_, {id}) => <DeleteButton id={id}/>,
        width: 100
    }
];

const getRowKey = (user: ClientDTOUserGetMany) => user.id

const UsersTable = () => {
    const {data, isFetching} = userApi.useGetAllUsersQuery({orderBy: {field: "rating", direction: ESortDirection.ASC}})

    return <Table
        style={{width: "100%"}}
        rowKey={getRowKey}
        dataSource={data}
        loading={isFetching}
        columns={COLUMNS}
    />

}

export {UsersTable}