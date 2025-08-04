import {IDomain} from "../Domains";
import {EOperandPredicate} from "@way-to-bot/shared/api/enums/EOperandPredicate";
import {EPredicate} from "@way-to-bot/shared/api/enums/EPredicate";
import {AdminDTOLeagueGetMany, AdminDTOLeagueGetOne} from "@way-to-bot/shared/api/DTO/admin/league.DTO";
import {CreateLeague} from "./Create";
import {EditLeague} from "./Edit";

const LeaguesDomain: IDomain<AdminDTOLeagueGetMany, AdminDTOLeagueGetOne, unknown, unknown> = {
    title: "Лиги",
    path: "leagues",
    url: "league",
    columns: [
        {
            title: "Название",
            dataIndex: "name",
        },
    ],
    options: {
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
    },
    create: {
        title: "Создать лигу",
        definition: <CreateLeague/>,
    },
    searchFields: ["name"],
    edit: {
        title: "Изменить лигу",
        definition: <EditLeague/>,
        getInitialValues: ({name}) => ({
            name,
        }),
    }
}

export {LeaguesDomain}