import { userApi } from "../../Store/User/UserApi";
import { Select, SelectProps } from "antd";
import { getUserFullName } from "@way-to-bot/shared/utils/GetUserFullName";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { FC } from "react";
import { UserOption } from "./UserOption";
import { AdminDTOUserGetMany } from "@way-to-bot/shared/api/DTO/admin/user.DTO";
import { EOperandPredicate } from "@way-to-bot/shared/api/enums/EOperandPredicate";
import { EPredicate } from "@way-to-bot/shared/api/enums/EPredicate";

const queryOptions: TCommonGetManyOptions = {
  where: {
    predicate: EPredicate.AND,
    operands: [
      {
        field: "username",
        predicate: EOperandPredicate.NOT_EQ,
        value: null,
      },
    ],
  },
};

const filterOption: SelectProps["filterOption"] = (inputValue, option) =>
  String(option?.label).toLowerCase().includes(inputValue.toLowerCase());

const optionRender: SelectProps["optionRender"] = ({ data }) => (
  <UserOption {...(data as AdminDTOUserGetMany)} />
);

type TSelectProps = Omit<
  SelectProps,
  "showSearch" | "options" | "loading" | "optionRender" | "filterOption"
>;

const UserSelect: FC<TSelectProps> = (props) => {
  const { data: response, isFetching } =
    userApi.useGetAllUsersQuery(queryOptions);

  const options = response?.data.map((user) => ({
    value: user.id,
    label: getUserFullName(user.firstName, user.lastName),
    ...user,
  }));

  return (
    <Select
      {...props}
      showSearch
      options={options}
      loading={isFetching}
      optionRender={optionRender}
      filterOption={filterOption}
    />
  );
};

export { UserSelect };
