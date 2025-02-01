import { createRoot } from "react-dom/client";
import "./main.css";
import {
  ConfigProvider,
  ConfigProviderProps,
  Layout,
  Menu,
  MenuProps,
  theme as antdTheme,
} from "antd";
import ru from "antd/locale/ru_RU";
import { CSSProperties } from "react";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import { ParticipateRequestsTable } from "./Domains/ParticipateRequests/Table";
import { Provider } from "react-redux";
import { STORE } from "./store";

const APP_CONFIG: ConfigProviderProps = {
  locale: ru,
  theme: {
    algorithm: antdTheme.defaultAlgorithm,
    cssVar: { key: "adminui" },
    hashed: false,
    components: {
      Layout: {
        headerHeight: 56,
      },
    },
  },
};

const LAYOUT_STYLE: CSSProperties = { minHeight: "100dvh" };

type TMenuItem = Required<MenuProps>["items"][number];

const MENU_ITEMS: TMenuItem[] = [
  {
    key: 1,
    label: (
      <NavLink to={WEBAPP_ROUTES.manageParticipateRequestsRoute}>
        {TEXT.participateRequests}
      </NavLink>
    ),
  },
];

const MAIN_STYLE: CSSProperties = {
  padding: 24,
};

const App = () => {
  return (
    <Provider store={STORE}>
      <BrowserRouter>
        <ConfigProvider {...APP_CONFIG}>
          <Layout style={LAYOUT_STYLE}>
            <Layout.Sider width="200px" theme={"light"}>
              <Menu
                defaultSelectedKeys={["1"]}
                mode="inline"
                items={MENU_ITEMS}
              />
            </Layout.Sider>
            <Layout.Content style={MAIN_STYLE}>
              <Routes>
                <Route path={WEBAPP_ROUTES.emptyRoute} element={null} />
                <Route
                  index
                  path={WEBAPP_ROUTES.manageParticipateRequestsRoute}
                  element={<ParticipateRequestsTable />}
                />
              </Routes>
            </Layout.Content>
          </Layout>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
