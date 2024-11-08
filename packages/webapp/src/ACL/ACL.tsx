import { EUserRole } from "@way-to-bot/shared/enums";
import { FC, PropsWithChildren } from "react";
import { userSlice } from "../Store/User/UserSlice";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { isDev } from "../Utils/OneLineUtils";

interface IACLProps {
  roles: EUserRole[];
}

const ACL: FC<PropsWithChildren<IACLProps>> = ({ roles, children }) => {
  const hasAccess = useParamSelector(
    userSlice.selectors.userHasAccessRoles,
    roles,
  );

  if (hasAccess || isDev) {
    return children;
  }

  return null;
};

export { ACL };
