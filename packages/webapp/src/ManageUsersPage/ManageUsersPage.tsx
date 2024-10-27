import { Avatar, List, Space } from "antd";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { createElement, FC } from "react";
import { CreateUserDrawer } from "../CreateUserDrawer/CreateUserDrawer";

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

const IconText = ({ icon, text }: { icon: FC; text: string }) => (
  <Space>
    {createElement(icon)}
    {text}
  </Space>
);

const ManageUsersPage = () => {
  return (
    <>
      <CreateUserDrawer />
      <List
        style={{ padding: 16 }}
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <IconText
                icon={StarOutlined}
                text="156"
                key="list-vertical-star-o"
              />,
              <IconText
                icon={LikeOutlined}
                text="156"
                key="list-vertical-like-o"
              />,
              <IconText
                icon={MessageOutlined}
                text="2"
                key="list-vertical-message"
              />,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={"small"}
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={<a href="https://ant.design">{item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      />
    </>
  );
};

export { ManageUsersPage };
