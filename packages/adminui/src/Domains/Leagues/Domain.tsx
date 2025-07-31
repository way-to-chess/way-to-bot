import {IDomain} from "../Domains";
import {EOperandPredicate} from "@way-to-bot/shared/api/enums/EOperandPredicate";
import {EPredicate} from "@way-to-bot/shared/api/enums/EPredicate";
import {AdminDTOLeagueGetMany, AdminDTOLeagueGetOne} from "@way-to-bot/shared/api/DTO/admin/league.DTO";

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
        definition: null,
    },
    searchFields: ["name"],
    edit: {
        title: "Изменить лигу",
        definition: null,
        getInitialValues: ({name}) => ({
            name,
        }),
    }
}

export {LeaguesDomain}