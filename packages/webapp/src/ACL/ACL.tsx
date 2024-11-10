import { EUserRole } from "@way-to-bot/shared/enums";
import { FC, PropsWithChildren } from "react";
import { userSlice } from "../Store/User/UserSlice";
import { useParamSelector } from "../Hooks/UseParamSelector";

interface IACLProps {
  roles: EUserRole[];
  exact?: boolean;
}

const ACL: FC<PropsWithChildren<IACLProps>> = ({
  roles,
  children,
  exact = false,
}) => {
  const hasAccess = useParamSelector(
    userSlice.selectors.userHasAccessRoles,
    roles,
    exact,
  );

  if (hasAccess) {
    return children;
  }

  return null;
};

export { ACL };
