import { memo } from "react";
import { Card, List } from "antd";
import { ManageLocationsDrawer } from "./ManageLocationsDrawer";
import { useSelector } from "react-redux";
import { locationsSlice } from "../Store/Locations/LocationsSlice";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";
import { LOCATIONS_GET_ALL_REQUEST_SYMBOL } from "../Store/Locations/LocationsVariables";
import { getPreviewSrc } from "../Utils/GetPreviewSrc";
import { TEXT } from "@way-to-bot/shared/constants/text";

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
        itemLayout={"vertical"}
        renderItem={({ preview, title, address, url, id }) => (
          <List.Item>
            <Card
              styles={{ cover: { height: 200 } }}
              style={{ width: "100%" }}
              actions={[
                url ? (
                  <a key={1} href={url} target={"_blank"} rel="noreferrer">
                    {TEXT.locations.map}
                  </a>
                ) : undefined,
              ]}
              cover={
                <img
                  alt="preview"
                  src={getPreviewSrc(preview?.url)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              }
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
