import { Empty, Flex, List } from "antd";
import { NavLink, useParams } from "react-router-dom";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { eventsSlice } from "../Store/Events/EventsSlice";
import { withProps } from "../Utils/WithProps";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { TEXT } from "@way-to-bot/shared/constants/text";

const ManageEventsIdPage = () => {
  const { eventId } = useParams();

  const event = useParamSelector(
    eventsSlice.selectors.eventById,
    Number(eventId),
  );

  if (!event) {
    return <Empty />;
  }

  return (
    <List itemLayout={"vertical"} style={{ padding: 16 }}>
      <List.Item>
        <Flex
          style={{ color: "black" }}
          gap={8}
          component={withProps(NavLink)({
            to: `/${WEBAPP_ROUTES.manageEventsRoute}`,
          })}
        >
          <ArrowLeftOutlined />

          <div>{TEXT.common.events}</div>
        </Flex>
      </List.Item>

      <List.Item>{event.status}</List.Item>
    </List>
  );
};

export { ManageEventsIdPage };
