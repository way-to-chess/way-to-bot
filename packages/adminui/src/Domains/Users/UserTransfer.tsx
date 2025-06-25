import {Spin, Transfer, TransferProps} from "antd";
import {userApi} from "../../Store/User/UserApi";
import {AdminDTOUserGetMany} from "@way-to-bot/shared/api/DTO/admin/user.DTO";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {EOperandPredicate, EPredicate} from "@way-to-bot/shared/api/enums/index";
import {FC, useState} from "react";
import {UserOption} from "./UserOption";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {EventSelect} from "../Events/EventSelect";
import {eventApi} from "../../Store/Event/EventApi";

const queryOptions: TCommonGetManyOptions = {
    where: {
        predicate: EPredicate.AND,
        operands: [{
            field: "username",
            predicate: EOperandPredicate.NOT_EQ,
            value: null
        }]
    }
}

const filterOption: TransferProps<AdminDTOUserGetMany>["filterOption"] = (inputValue, {firstName, lastName}) =>
    String(getUserFullName(firstName, lastName)).toLowerCase().includes(inputValue.toLowerCase())


type TTransferProps = Omit<
    TransferProps,
    "footer" | "showSearch" | "listStyle" | "titles" | "dataSource" | "filterOption" | "oneWay" | "rowKey"
>

const render: TransferProps<AdminDTOUserGetMany>["render"] = (user) => <UserOption {...user}/>

const UserTransfer: FC<TTransferProps> = (props) => {
    const {data: users, isFetching: usersIsFetching} = userApi.useGetAllUsersQuery(queryOptions)
    const [getEvent, {isFetching: eventsIsFetching}] = eventApi.useLazyGetEventByIdQuery()
    const [eventId, setEventId] = useState<number | null>(null)
    const [selectedKeys, setSelectedKeys] = useState<number[]>([])

    const loading = usersIsFetching || eventsIsFetching

    const onChange = (eventId: number) => {
        getEvent({id: eventId}).unwrap().then((event) => {
            setSelectedKeys(event.users.map(({id}) => id))
            setEventId(eventId)
        })
    }

    const onSelectChange: TransferProps<AdminDTOUserGetMany>["onSelectChange"] = (sourceSelectedKeys) => {
        setSelectedKeys(sourceSelectedKeys as number[])
    }

    const onClear = () => {
        setSelectedKeys([])
    }

    const renderFooter: TransferProps<AdminDTOUserGetMany>["footer"] = (props, info) =>
        info?.direction === "left" ?
            <EventSelect style={{padding: 4, height: 40}} allowClear onClear={onClear} placeholder={"Выберите событие"}
                         onChange={onChange}
                         value={eventId}/> : null

    return <Spin spinning={loading}>
        <Transfer showSearch listStyle={{flex: 1, height: 400}}
                  titles={['  ', 'Получат сообщение']}
                  dataSource={users?.data} render={render}
                  filterOption={filterOption}
                  onSelectChange={onSelectChange}
                  oneWay rowKey={(it) => it.id} footer={renderFooter} selectedKeys={selectedKeys} {...props}/>
    </Spin>
}

export {UserTransfer}