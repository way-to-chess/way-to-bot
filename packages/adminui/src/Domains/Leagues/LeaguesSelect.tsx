import {memo} from "react";
import {Select, SelectProps} from "antd";
import {clientApi} from "@way-to-bot/webapp/REFACTOR/Store/ClientApi";

const LeaguesSelect = memo<Omit<SelectProps, "options" | "loading">>(
    (props) => {
        const {isFetching, data} = clientApi.useGetAllLeaguesQuery();

        return (
            <Select
                loading={isFetching}
                options={data?.map(({id, name}) => ({
                    value: id,
                    label: name,
                }))}
                {...props}
            />
        );
    },
);

export {LeaguesSelect};
