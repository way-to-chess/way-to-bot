import "./App.css";
import {
  ConfigProvider,
  ConfigProviderProps,
  Flex,
  Layout,
  Menu,
  MenuProps,
  theme as antdTheme,
} from "antd";
import ru from "antd/locale/ru_RU";
import { CSSProperties } from "react";

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
    label: "Test",
  },
];

const MAIN_STYLE: CSSProperties = {
  padding: 24,
};

const CONTENT_STYLE: CSSProperties = {
  background: "var(--ant-color-bg-container)",
  height: "100%",
  borderRadius: "var(--ant-border-radius-lg)",
  padding: 24,
};

const App = () => {
  return (
    <ConfigProvider {...APP_CONFIG}>
      <Layout style={LAYOUT_STYLE}>
        <Layout.Header></Layout.Header>

        <Layout>
          <Layout.Sider width="200px" theme={"light"}>
            <Menu
              defaultSelectedKeys={["1"]}
              mode="inline"
              items={MENU_ITEMS}
            />
          </Layout.Sider>
          <Layout.Content style={MAIN_STYLE}>
            <Flex style={CONTENT_STYLE}>{"Contet"}</Flex>
          </Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export { App };
