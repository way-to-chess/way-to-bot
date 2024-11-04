import { memo } from "react";
import { Card, List } from "antd";
import { ManageLocationsDrawer } from "./ManageLocationsDrawer";
import { useSelector } from "react-redux";
import { locationsSlice } from "../Store/Locations/LocationsSlice";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { LOCATIONS_GET_ALL_REQUEST_SYMBOL } from "../Store/Locations/LocationsVariables";

const ManageLocationsPage = memo(() => {
  const locations = useSelector(locationsSlice.selectors.locations);
  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    LOCATIONS_GET_ALL_REQUEST_SYMBOL,
  );

  return (
    <>
      <ManageLocationsDrawer />

      <List
        loading={status === ERequestStatus.loading}
        style={{ padding: 16 }}
        dataSource={locations}
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
