import {Flex, Table, TableProps, Typography} from "antd";
import {TEXT} from "@way-to-bot/shared/constants/text";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {ClientDTOUserGetMany} from "@way-to-bot/shared/api/DTO/client/user.DTO";
import {userApi} from "../../Store/User/UserApi";

const COLUMNS: TableProps<ClientDTOUserGetMany>["columns"] = [
    {
        title: TEXT.user,
        render: (_, {firstName, lastName, username}) => (
            <Flex vertical>
                <Typography.Text>
                    {getUserFullName(firstName, lastName)}
                </Typography.Text>
                <Typography.Text type={"secondary"}>{username}</Typography.Text>
            </Flex>
        ),
    },
];

const getRowKey = (user: ClientDTOUserGetMany) => user.id

const UsersTable = () => {
    const {data, isFetching} = userApi.useGetAllUsersQuery()

    return <Table
        style={{width: "100%"}}
        rowKey={getRowKey}
        dataSource={data}
        loading={isFetching}
        columns={COLUMNS}
    />

}

export {UsersTable}