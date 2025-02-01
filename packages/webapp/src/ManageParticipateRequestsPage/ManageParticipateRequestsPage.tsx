import { memo } from "react";
import { IParticipateRequest } from "@way-to-bot/shared/interfaces/participate-request.interface";
import { Badge, Button, Flex, Table, TableProps, Typography } from "antd";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { GET_ALL_PARTICIPATE_REQUESTS_REQUEST_SYMBOL } from "../Store/ParticipateRequest/ParticipateRequestVariables";
import { useSelector } from "react-redux";
import { participateRequestSlice } from "../Store/ParticipateRequest/ParticipateRequestSlice";
import { TEXT } from "@way-to-bot/shared/constants/text";
import type { ExpandableConfig } from "rc-table/lib/interface";
import { getPreviewSrc } from "../Utils/GetPreviewSrc";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { ApproveParticipateRequestDrawer } from "./ApproveParticipateRequestDrawer";
import type { IWithRequestId } from "../Types";
import { getUserFullName } from "../Utils/GetUserFullName";
import dayjs from "dayjs";

const COLUMNS: TableProps<IParticipateRequest>["columns"] = [
  {
    title: TEXT.user,
    render: (_, { user }) => (
      <Flex vertical>
        <Typography.Text>
          {getUserFullName(user.firstName, user.lastName)}
        </Typography.Text>
        <Typography.Text type={"secondary"}>{user.username}</Typography.Text>
      </Flex>
    ),
  },
  { title: TEXT.event, render: (_, { event }) => event.name },
  {
    title: TEXT.status,
    render: (_, { approved }) => (
      <Badge
        status={approved ? "success" : "processing"}
        text={approved ? TEXT.approvedStatus : TEXT.waitingStatus}
      />
    ),
    minWidth: 150,
  },
];

const OpenApproveDrawer = memo<IWithRequestId>(({ requestId }) => {
  const open = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.APPROVE_PARTICIPATE_REQUEST_DRAWER,
    data: { requestId },
  });

  return (
    <Button type={"primary"} onClick={open}>
      {TEXT.approve}
    </Button>
  );
});

const EXPANDABLE_CONFIG: ExpandableConfig<IParticipateRequest> = {
  expandedRowRender: ({ receipt, id, approved, updatedAt }) => {
    return (
      <Flex align={"center"} justify={"space-between"}>
        {receipt ? (
          <Typography.Link
            href={getPreviewSrc(receipt.url)}
            target={"_blank"}
            rel="noreferrer"
          >
            {TEXT.showFile}
          </Typography.Link>
        ) : (
          <Typography.Text type={"danger"}>{TEXT.noFile}</Typography.Text>
        )}
        {approved ? (
          dayjs(updatedAt).format("DD/YYYY, HH:MM")
        ) : (
          <OpenApproveDrawer requestId={id} />
        )}
      </Flex>
    );
  },
};

const getRowKey = (request: IParticipateRequest) => request.id;

const ManageParticipateRequestsPage = memo(() => {
  const loading = useParamSelector(
    requestManagerSlice.selectors.loadingBySymbol,
    GET_ALL_PARTICIPATE_REQUESTS_REQUEST_SYMBOL,
  );

  const allRequests = useSelector(
    participateRequestSlice.selectors.allRequests,
  );

  return (
    <>
      <ApproveParticipateRequestDrawer />
      <Table
        rowKey={getRowKey}
        dataSource={allRequests}
        loading={loading}
        columns={COLUMNS}
        pagination={false}
        expandable={EXPANDABLE_CONFIG}
      />
    </>
  );
});

export { ManageParticipateRequestsPage };
