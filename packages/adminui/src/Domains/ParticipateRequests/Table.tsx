import { memo } from "react";
import { Badge, Button, Flex, Table, TableProps, Typography } from "antd";
import { IParticipateRequest } from "@way-to-bot/shared/interfaces/participate-request.interface";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { getUserFullName } from "@way-to-bot/shared/utils/GetUserFullName";
import type { IWithRequestId } from "@way-to-bot/shared/interfaces/with.interface";
import type { ExpandableConfig } from "rc-table/lib/interface";
import { getPreviewSrc } from "@way-to-bot/shared/utils/GetPreviewSrc";
import dayjs from "dayjs";
import { participateRequestsApi } from "./Slice";

const DATE_TIME_FORMAT = "HH:MM DD/YYYY";

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
  },
  {
    title: TEXT.createdAt,
    render: ({ createdAt }) => dayjs(createdAt).format(DATE_TIME_FORMAT),
  },
];

const OpenApproveDrawer = memo<IWithRequestId>(({ requestId }) => {
  const [approve, { isLoading, error }] =
    participateRequestsApi.useApproveParticipateRequestMutation();

  const onClick = () => {
    approve({ id: requestId });
  };

  return (
    <Button type={"primary"} loading={isLoading} onClick={onClick}>
      {TEXT.approve}
    </Button>
  );
});

const EXPANDABLE_CONFIG: ExpandableConfig<IParticipateRequest> = {
  expandRowByClick: true,
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
          dayjs(updatedAt).format(DATE_TIME_FORMAT)
        ) : (
          <OpenApproveDrawer requestId={id} />
        )}
      </Flex>
    );
  },
};

const getRowKey = (request: IParticipateRequest) => request.id;

const ParticipateRequestsTable = () => {
  const { data, isFetching } =
    participateRequestsApi.useGetAllParticipateRequestsQuery();

  return (
    <Table
      style={{ width: "100%" }}
      rowKey={getRowKey}
      dataSource={data}
      loading={isFetching}
      columns={COLUMNS}
      pagination={false}
      expandable={EXPANDABLE_CONFIG}
    />
  );
};

export { ParticipateRequestsTable };
