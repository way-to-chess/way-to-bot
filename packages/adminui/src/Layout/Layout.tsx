import {ConfigProvider, ConfigProviderProps, Layout as AntLayout, Menu, MenuProps, theme as antdTheme} from "antd";
import {NavLink, Outlet} from "react-router";
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
        key: 1,
        label: (
            <NavLink to={ROUTES.users}>
                {"Пользователи"}
            </NavLink>
        ),
    },
];

const MAIN_STYLE: CSSProperties = {
    padding: 24,
};

const Layout = () => {
    return <ConfigProvider {...APP_CONFIG}>
        <AntLayout style={LAYOUT_STYLE}>
            <AntLayout.Sider width="200px" theme={"light"}>
                <Menu
                    defaultSelectedKeys={["1"]}
                    mode="inline"
                    items={MENU_ITEMS}
                />
            </AntLayout.Sider>
            <AntLayout.Content style={MAIN_STYLE}>
                <Outlet/>
            </AntLayout.Content>
        </AntLayout>
    </ConfigProvider>
}

export {Layout}