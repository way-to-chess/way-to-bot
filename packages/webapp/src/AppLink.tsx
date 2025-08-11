import {Link, LinkProps, NavLink, NavLinkProps} from "react-router";
import * as React from "react";
import {FC} from "react";
import {useEventType} from "./Hooks/UseEventType";

type TAppLinkProps = React.RefAttributes<HTMLAnchorElement> & { to: string }

const useLinkPath = (to: string) => {
    const eventType = useEventType()

    return to.replace(":type", eventType ?? "")
}

const AppLink: FC<Omit<LinkProps, "to"> & TAppLinkProps> = ({children, to, ...rest}) => {
    const path = useLinkPath(to)

    return <Link to={path} {...rest}>
        {children}
    </Link>
}

const AppNavLink: FC<Omit<NavLinkProps, "to"> & TAppLinkProps> = ({children, to, ...rest}) => {
    const path = useLinkPath(to)

    return <NavLink to={path} {...rest}>
        {children}
    </NavLink>
}

export {AppLink, AppNavLink}