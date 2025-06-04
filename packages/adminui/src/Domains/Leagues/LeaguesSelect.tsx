import {memo} from "react";
import {Select, SelectProps} from "antd";
import {leagueApi} from "../../Store/League/LeagueApi";

const LeaguesSelect = memo<Omit<SelectProps, "options" | "loading">>(
    (props) => {
        const {isFetching, data} = leagueApi.useGetAllLeaguesQuery({});

        return (
            <Select
                loading={isFetching}
                options={data?.data?.map(({id, name}) => ({
                    value: id,
                    label: name,
                }))}
                {...props}
            />
        );
    },
);

export {LeaguesSelect};
