import {memo} from "react";
import {Select, SelectProps} from "antd";
import {adminApi} from "../../Store/AdminApi";
import {EPredicate} from "@way-to-bot/shared/api/enums/EPredicate";
import {EOperandPredicate} from "@way-to-bot/shared/api/enums/EOperandPredicate";
import {AdminDTOLeagueGetManyResponse} from "@way-to-bot/shared/api/DTO/admin/league.DTO";

const LeaguesSelect = memo<Omit<SelectProps, "options" | "loading">>(
    (props) => {
        const {data: leagues, isFetching} = adminApi.useGetManyQuery({
            url: "league", options: {
                where: {
                    predicate: EPredicate.AND,
                    operands: [
                        {
                            field: "name",
                            predicate: EOperandPredicate.NOT_EQ,
                            value: "DEFAULT",
                        },
                    ],
                }
            }
        })

        return (
            <Select
                loading={isFetching}
                options={(leagues as AdminDTOLeagueGetManyResponse)?.data?.map(({id, name}) => ({
                    value: id,
                    label: name,
                }))}
                {...props}
            />
        );
    },
);

export {LeaguesSelect};
