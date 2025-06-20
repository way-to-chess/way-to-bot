import {ConfigProvider, ConfigProviderProps, Layout as AntLayout, Menu, MenuProps, theme as antdTheme} from "antd";
import {Link, Outlet, useLocation} from "react-router";
import {ROUTES} from "../Constants/Routes";
import ru from "antd/locale/ru_RU";
import {CSSProperties} from "react";

const APP_CONFIG: ConfigProviderProps = {
    locale: ru,
    theme: {
        algorithm: antdTheme.defaultAlgorithm,
        cssVar: {key: "adminui"},
        hashed: false,
        components: {
            Layout: {
                headerHeight: 56,
            },
        },
    },
};

const LAYOUT_STYLE: CSSProperties = {minHeight: "100dvh"};

type TMenuItem = Required<MenuProps>["items"][number];

const MENU_ITEMS: TMenuItem[] = [
    {
        key: ROUTES.users,
        label: (
            <Link to={ROUTES.users}>
                {"Пользователи"}
            </Link>
        ),
    },
    {
        key: ROUTES.participateRequestsRoute,
        label: (
            <Link to={ROUTES.participateRequestsRoute}>
                {"Запросы"}
            </Link>
        ),
    },
    {
        key: ROUTES.events,
        label: (
            <Link to={ROUTES.events}>
                {"События"}
            </Link>
        ),
    },
];

const MAIN_STYLE: CSSProperties = {
    padding: 24,
};
const Layout = () => {
    const location = useLocation()

    return <ConfigProvider {...APP_CONFIG}>
        <AntLayout style={LAYOUT_STYLE}>
            <AntLayout.Sider width="200px" theme={"light"}>
                <Menu mode="inline" items={MENU_ITEMS} defaultSelectedKeys={[location.pathname]}/>
            </AntLayout.Sider>
            <AntLayout.Content style={MAIN_STYLE}>
                <Outlet/>
            </AntLayout.Content>
        </AntLayout>
    </ConfigProvider>
}

export {Layout}