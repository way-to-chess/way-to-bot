import { Avatar, Flex, Select, SelectProps, Typography } from "antd";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { FC } from "react";
import { getPreviewSrc } from "@way-to-bot/shared/utils/GetPreviewSrc";
import { AdminDTOEventGetMany } from "@way-to-bot/shared/api/DTO/admin/event.DTO";
import dayjs from "dayjs";
import { eventApi } from "../../Store/Event/EventApi";
import { ESortDirection } from "@way-to-bot/shared/api/enums/ESortDirection";

const queryOptions: TCommonGetManyOptions = {
  sort: {
    field: "dateTime",
    direction: ESortDirection.DESC,
  },
};

const filterOption: SelectProps["filterOption"] = (inputValue, option) =>
  String(option?.label).toLowerCase().includes(inputValue.toLowerCase());

const EventOption: FC<Omit<AdminDTOEventGetMany, "countParticipants">> = ({
  name,
  preview,
  dateTime,
  participantsCount,
  participantsLimit,
}) => {
  return (
    <Flex align={"center"} gap={8}>
      <Avatar
        src={getPreviewSrc(preview?.previewUrl)}
        size={"large"}
        style={{ flexShrink: 0 }}
      />
      <Flex vertical>
        <Typography.Text strong>{name}</Typography.Text>
        <Typography>
          {dayjs(dateTime).format("D MMMM, dd HH:mm")}{" "}
          <Typography.Text>
            {`(${participantsCount}/${participantsLimit})`}
          </Typography.Text>
        </Typography>
      </Flex>
    </Flex>
  );
};

const optionRender: SelectProps["optionRender"] = ({ data }) => (
  <EventOption {...(data as AdminDTOEventGetMany)} />
);

type TSelectProps = Omit<
  SelectProps,
  "showSearch" | "options" | "loading" | "optionRender" | "filterOption"
>;

const EventSelect: FC<TSelectProps> = (props) => {
  const { data: response, isFetching } =
    eventApi.useGetAllEventsQuery(queryOptions);

  const options = response?.data.map((it) => ({
    value: it.id,
    label: it.name,
    ...it,
  }));

  return (
    <Select
      {...props}
      showSearch
      options={options}
      loading={isFetching}
      optionRender={optionRender}
      filterOption={filterOption}
    />
  );
};

export { EventSelect };
