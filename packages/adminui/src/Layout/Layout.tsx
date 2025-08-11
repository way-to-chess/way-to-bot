import {ConfigProvider, ConfigProviderProps, Layout as AntLayout, Menu, theme as antdTheme,} from "antd";
import {Link, Outlet, useLocation} from "react-router";
import ru from "antd/locale/ru_RU";
import {CSSProperties} from "react";
import {Domains} from "../Domains/Domains";

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

const MENU_ITEMS = Domains.map(({title, path}) => {
    const to = `/admin/${path}`;

    return {
        key: to,
        label: <Link to={to}>{title}</Link>,
    };
});

const MAIN_STYLE: CSSProperties = {
    padding: 24,
};

const Layout = () => {
    const location = useLocation();

    return (
        <ConfigProvider {...APP_CONFIG}>
            <AntLayout style={LAYOUT_STYLE}>
                <AntLayout.Sider width="200px" theme={"light"}>
                    <Menu
                        mode="inline"
                        items={MENU_ITEMS}
                        defaultSelectedKeys={[location.pathname]}
                    />
                </AntLayout.Sider>
                <AntLayout.Content style={MAIN_STYLE}>
                    <Outlet/>
                </AntLayout.Content>
            </AntLayout>
        </ConfigProvider>
    );
};

export {Layout};
