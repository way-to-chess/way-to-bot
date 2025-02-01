import "./App.css";
import { Layout, Menu, MenuProps } from "antd";

const LAYOUT_STYLE = { minHeight: "100dvh" };

type TMenuItem = Required<MenuProps>["items"][number];

const MENU_ITEMS: TMenuItem[] = [
  {
    key: 1,
    label: "Test",
  },
];

const App = () => {
  return (
    <Layout style={LAYOUT_STYLE}>
      <Layout.Sider width="25%">
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={MENU_ITEMS}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Header>Header</Layout.Header>
        <Layout.Content>Content</Layout.Content>
      </Layout>
    </Layout>
  );
};

export { App };
