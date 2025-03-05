import { memo } from "react";
import { Select, SelectProps } from "antd";
import { api } from "@way-to-bot/shared/Api";

const LeaguesSelect = memo<Omit<SelectProps, "options" | "loading">>(
  (props) => {
    const { isFetching, data } = api.useGetAllLeaguesQuery();

    return (
      <Select
        loading={isFetching}
        options={data?.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        {...props}
      />
    );
  },
);

export { LeaguesSelect };
