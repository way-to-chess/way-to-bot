import { memo } from "react";
import { Card, List } from "antd";
import { LOCATIONS } from "../LOCATIONS";
import { ManageLocationsDrawer } from "./ManageLocationsDrawer";

const ManageLocationsPage = memo(() => {
  return (
    <>
      <ManageLocationsDrawer />

      <List
        style={{ padding: 16 }}
        dataSource={LOCATIONS}
        renderItem={({ preview, title, address, id }) => (
          <List.Item>
            <Card
              styles={{ cover: { height: 200 } }}
              style={{ width: "100%" }}
              cover={
                <img
                  alt="preview"
                  src={preview?.url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              }
              hoverable
              key={id}
            >
              <Card.Meta title={title} description={address} />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
});
ManageLocationsPage.displayName = "ManageLocationsPage";

export { ManageLocationsPage };
