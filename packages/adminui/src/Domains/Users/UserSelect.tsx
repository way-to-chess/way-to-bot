import {userApi} from "../../Store/User/UserApi";
import {Avatar, Flex, Select, SelectProps, Typography} from "antd";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {EOperandPredicate, EPredicate} from "@way-to-bot/shared/api/enums/index";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {FC} from "react";

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

const filterOption: SelectProps["filterOption"] = (inputValue, option) =>
    String(option?.label).toLowerCase().includes(inputValue.toLowerCase())

const optionRender: SelectProps["optionRender"] = ({label, data}) => (
    <Flex align={"center"} gap={8}>
        <Avatar src={data.previewUrl} size={"large"}/>
        <Flex vertical>
            <Typography.Text strong>
                {label}
            </Typography.Text>
            <Typography>
                {data.username}
            </Typography>
        </Flex>
    </Flex>
)

type TSelectProps = Omit<SelectProps, "showSearch" | "options" | "loading" | "optionRender" | "filterOption" | "placeholder">

const UserSelect: FC<TSelectProps> = (props) => {
    const {data: response, isFetching} = userApi.useGetAllUsersQuery(queryOptions)

    const options = response?.data.map(({id, firstName, lastName, username, photo}) => ({
        value: id,
        label: getUserFullName(firstName, lastName),
        username,
        previewUrl: getPreviewSrc(photo?.previewUrl)
    }))

    return <Select {...props} showSearch options={options} loading={isFetching} optionRender={optionRender}
                   filterOption={filterOption} placeholder={"Выберите пользователя"}/>
}

export {UserSelect}