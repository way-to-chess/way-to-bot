import { useSelector } from "react-redux";
import { locationsSelectors } from "../../../Store/Locations/LocationsSelector";
import { ComponentType, createElement, FC, Fragment } from "react";
import { withProps } from "../../../Utils/WithProps";
import { Card, Flex, Skeleton } from "antd";
import { EditOutlined } from "@ant-design/icons";
import AnchorLink from "antd/es/anchor/AnchorLink";
import { generatePath, Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { requestManagerSlice } from "../../../Store/RequestManager/RequestManagerSlice";
import { LOCATIONS_GET_ALL_REQUEST_SYMBOL } from "../../../Store/Locations/LocationsVariables";
import { useParamSelector } from "../../../Hooks/UseParamSelector";
import { ERequestStatus } from "../../../Store/RequestManager/RequestManagerModels";
import { getPreviewSrc } from "../../../Utils/GetPreviewSrc";
import { DeleteButton } from "../../../Components/DeleteButton";
import { locationsSlice } from "../../../Store/Locations/LocationsSlice";
import { FixedButton } from "../../../Components/FixedButton";

const DELETE_LOCATION_TITLE = "Delete Location?";

//todo get type from server
type Location = any;

const LocationCard: FC<Location> = ({ preview, url, address, title, id }) => {
  const updateLocationUrl = generatePath(WEBAPP_ROUTES.updateLocationRoute, {
    locationId: id,
  });

  return (
    <Card
      cover={<img alt="example" src={getPreviewSrc(preview?.url)} />}
      actions={[
        <Link to={updateLocationUrl}>
          <EditOutlined key="edit" />
        </Link>,
        <DeleteButton
          actionCreator={locationsSlice.actions.delete}
          title={DELETE_LOCATION_TITLE}
          id={id}
        />,
      ]}
    >
      <Card.Meta title={title} description={address} />
      {url ? <AnchorLink href={url} title={"Url"} /> : url}
    </Card>
  );
};

const LocationsPageSuccess = () => {
  const locations = useSelector(locationsSelectors.data);

  return (
    <Flex vertical gap={16} style={{ padding: "16px 16px 62px" }}>
      {locations.map((location) => (
        <LocationCard {...location} key={location.id} />
      ))}

      <Link to={WEBAPP_ROUTES.createLocationRoute}>
        <FixedButton />
      </Link>
    </Flex>
  );
};

const Loading = withProps(Skeleton)({
  style: { padding: "16px" },
});

const SLICE_STATUS_TO_COMPONENT_TYPE_MAP: Record<
  ERequestStatus,
  ComponentType
> = {
  [ERequestStatus.idle]: Fragment,
  [ERequestStatus.loading]: Loading,
  [ERequestStatus.error]: Fragment,
  [ERequestStatus.success]: LocationsPageSuccess,
};

const LocationsPage = () => {
  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    LOCATIONS_GET_ALL_REQUEST_SYMBOL,
  );

  return createElement(SLICE_STATUS_TO_COMPONENT_TYPE_MAP[status]);
};

export { LocationsPage };
