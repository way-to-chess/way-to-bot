import { memo } from "react";
import { Card, List } from "antd";

const dataSource = [];

const ManageLocationsPage = memo(() => {
  const value = "ManageLocationsPage";

  return (
    <List>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={
          <img
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          />
        }
      >
        <Card.Meta title="Europe Street beat" description="www.instagram.com" />
      </Card>
    </List>
  );
});
ManageLocationsPage.displayName = "ManageLocationsPage";

export { ManageLocationsPage };
