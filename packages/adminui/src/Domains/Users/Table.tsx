import {Avatar, Button, Flex, Input, Popconfirm, Table, TableProps, Tag, Typography} from "antd";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {userApi} from "../../Store/User/UserApi";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {EOperandPredicate, EPredicate, ESortDirection, EUserRole} from "@way-to-bot/shared/api/enums/index";
import {FC, useState} from "react";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {AdminDTOUserGetMany} from "@way-to-bot/shared/api/DTO/admin/user.DTO";
import {PlusIcon} from "lucide-react";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";

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

const COLUMNS: TableProps<AdminDTOUserGetMany>["columns"] = [
    {
        title: "ID",
        dataIndex: "id",
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

const getRowKey = (user: AdminDTOUserGetMany) => user.id

const UsersTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sortField, setSortField] = useState<string | undefined>(undefined)
    const [sortDirection, setSortDirection] = useState(ESortDirection.DESC)
    const [searchValue, setSearchValue] = useState("")

    const offset = (currentPage - 1) * pageSize

    const options: TCommonGetManyOptions = {
        pagination: {limit: pageSize, offset},
    }

    if (sortField) {
        options.sort = {
            field: sortField,
            direction: sortDirection
        }
    }

    const searchValueToSend = searchValue.trim()

    if (searchValueToSend) {
        options.where = {
            predicate: EPredicate.OR,
            operands: [
                {
                    field: "firstName",
                    predicate: EOperandPredicate.LIKE,
                    value: searchValueToSend
                },
                {
                    field: "lastName",
                    predicate: EOperandPredicate.LIKE,
                    value: searchValueToSend
                },
                {
                    field: "username",
                    predicate: EOperandPredicate.LIKE,
                    value: searchValueToSend
                }
            ]
        }
    }

    const {data, isFetching} = userApi.useGetAllUsersQuery(options)

    const onChange: TableProps<AdminDTOUserGetMany>["onChange"] =
        (pagination, filters, sorter, extra) => {
            if (pagination.current) {
                setCurrentPage(pagination.current)
            }

            if (pagination.pageSize) {
                setPageSize(pagination.pageSize)
            }

            const sort = Array.isArray(sorter) ? sorter[0] : sorter

            if (sort) {
                setSortField(Array.isArray(sort.field) ? sort.field[0] : sort.field)
                setSortDirection(sort.order === "ascend" ? ESortDirection.ASC : ESortDirection.DESC)
            }

            console.log('params', pagination, filters, sorter, extra);
        }

    return <Flex vertical gap={8}>
        <Flex justify={"space-between"} gap={8}>
            <Input.Search style={{maxWidth: 400}} placeholder={"Найти"} value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}/>
            <Button icon={<PlusIcon size={14}/>} type={"primary"}>
                {"Создать"}
            </Button>
        </Flex>
        <Table
            pagination={{
                current: currentPage,
                pageSize,
                total: data?.pagination.totalRows
            }}
            style={{width: "100%"}}
            rowKey={getRowKey}
            dataSource={data?.data}
            loading={isFetching}
            columns={COLUMNS}
            onChange={onChange}
        />
    </Flex>

}

export {UsersTable}