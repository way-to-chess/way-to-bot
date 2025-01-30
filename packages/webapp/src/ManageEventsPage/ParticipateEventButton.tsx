import { TEXT } from "@way-to-bot/shared/constants/text";
import { Button, Drawer, Form, Typography, Upload } from "antd";
import { memo, useState } from "react";
import { IFileUploadResponse, useFileUpload } from "../Hooks/UseFileUpload";
import { useDispatch, useSelector } from "react-redux";
import { userSlice } from "../Store/User/UserSlice";
import { participateRequestSlice } from "../Store/ParticipateRequest/ParticipateRequestSlice";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { eventsSlice } from "../Store/Events/EventsSlice";
import { IWithEventId } from "../Store/Events/EventsTypes";
import { EEventStatus } from "@way-to-bot/shared/enums";
import { Link } from "react-router-dom";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { useDrawer } from "../Hooks/UseDrawer";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { PARTICIPATE_REQUEST_CREATE_REQUEST_SYMBOL } from "../Store/ParticipateRequest/ParticipateRequestVariables";

const PARTICIPATE_BUTTON_STYLE = {
  width: "50%",
  position: "fixed",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
} as const;

const ExistsUserParticipateButton = memo<IWithEventId>(({ eventId }) => {
  const openConfirm = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.CONFIRM_PARTICIPATE_REQUEST_DRAWER,
    data: { eventId },
  });

  const userId = useSelector(userSlice.selectors.userId);

  const hasPendingParticipateRequest = useParamSelector(
    eventsSlice.selectors.hasPendingParticipateRequest,
    eventId,
    userId,
  );

  return (
    <Button
      onClick={openConfirm}
      type={"primary"}
      style={PARTICIPATE_BUTTON_STYLE}
      disabled={hasPendingParticipateRequest}
    >
      {hasPendingParticipateRequest ? TEXT.hasPendingRequest : TEXT.participate}
    </Button>
  );
});

const WaitingEventParticipateButton = memo<IWithEventId>(({ eventId }) => {
  const userExists = useSelector(userSlice.selectors.userExists);

  if (!userExists) {
    return (
      <Link to={WEBAPP_ROUTES.registrationRoute}>
        <Button type={"primary"} style={PARTICIPATE_BUTTON_STYLE}>
          {TEXT.participate}
        </Button>
      </Link>
    );
  }

  return <ExistsUserParticipateButton eventId={eventId} />;
});

const ParticipateButton = memo<IWithEventId>(({ eventId }) => {
  const eventStatus = useParamSelector(
    eventsSlice.selectors.eventStatusById,
    eventId,
  );

  if (eventStatus !== EEventStatus.WAITING) {
    return null;
  }

  return <WaitingEventParticipateButton eventId={eventId} />;
});

const ParticipateEventButton = memo<IWithEventId>(({ eventId }) => {
  const { open, onClose } = useDrawer(
    EDrawerType.CONFIRM_PARTICIPATE_REQUEST_DRAWER,
  );

  const [fileId, setFileId] = useState(0);

  const userId = useSelector(userSlice.selectors.userId);

  const disabled = fileId === 0;

  const uploadProps = useFileUpload({
    onRemove: () => {
      setFileId(0);
    },
    onDone: ({ id }: IFileUploadResponse) => {
      setFileId(id);
    },
    onError: () => {
      setFileId(0);
    },
  });

  const dispatch = useDispatch();

  if (!userId) {
    return null;
  }

  const onFinish = () => {
    if (disabled) {
      return;
    }

    dispatch(
      participateRequestSlice.actions.createParticipateRequest({
        userId,
        fileId,
        eventId,
      }),
    );
  };

  const loading = useParamSelector(
    requestManagerSlice.selectors.loadingBySymbol,
    PARTICIPATE_REQUEST_CREATE_REQUEST_SYMBOL,
  );

  return (
    <>
      <ParticipateButton eventId={eventId} />
      <Drawer
        open={open}
        width={"100%"}
        onClose={onClose}
        placement={"right"}
        closable
        styles={{
          body: {
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Typography.Title level={3}>
          {TEXT.participateRequestIntro}
        </Typography.Title>
        <Form
          onFinish={onFinish}
          layout={"vertical"}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Form.Item name={"fileId"} style={{ flex: 1 }}>
            <Upload {...uploadProps} listType={"picture"}>
              {disabled ? (
                <Button type={"dashed"}>{TEXT.common.upload}</Button>
              ) : null}
            </Upload>
          </Form.Item>

          <Form.Item style={{ alignSelf: "center" }}>
            <Button
              type={"primary"}
              htmlType={"submit"}
              disabled={disabled}
              loading={loading}
            >
              {TEXT.confirmParticipateRequest}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
});

export { ParticipateEventButton };
