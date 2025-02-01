import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { getUserFullName } from "@way-to-bot/shared/utils/GetUserFullName";
import { Select, SelectProps } from "antd";
import { useSelector } from "react-redux";
import { userSlice } from "../Store/User/UserSlice";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { USERS_LOAD_REQUEST_SYMBOL } from "../Store/User/UserVariables";
import { FC } from "react";
import { IUser } from "@way-to-bot/shared/interfaces/user.interface";

interface IUserSelectProps
  extends Omit<SelectProps, "mode" | "loading" | "options"> {
  filterUsers?: (user: IUser) => boolean;
}

const UsersSelect: FC<IUserSelectProps> = ({ filterUsers, ...props }) => {
  const users = useSelector(userSlice.selectors.users);

  const usersStatus = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    USERS_LOAD_REQUEST_SYMBOL,
  );

  const filtered = filterUsers ? users.filter(filterUsers) : users;

  const options = filtered.map(({ id, firstName, lastName }) => ({
    value: id,
    label: getUserFullName(firstName, lastName),
  }));

  return (
    <Select
      mode={"multiple"}
      loading={usersStatus === ERequestStatus.loading}
      options={options}
      {...props}
    />
  );
};

export { UsersSelect };
