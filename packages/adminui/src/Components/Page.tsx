import {FC, useState,} from "react";
import {Flex, Result, Skeleton, Table as AntTable, TableProps} from "antd";
import {extractId} from "../Utils/Extract";
import {adminApi} from "../Store/AdminApi";
import {IDomain} from "../Domains/Domains";
import {ESortDirection} from "@way-to-bot/shared/api/enums/ESortDirection";
import {TCommonGetManyOptions} from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import {EPredicate} from "@way-to-bot/shared/api/enums/EPredicate";
import {EOperandPredicate} from "@way-to-bot/shared/api/enums/EOperandPredicate";
import {EditContextProvider, EditDrawer} from "./Edit";
import {DomainContextProvider, useDomainContext} from "./Domain";
import {CreateButton, CreateContextProvider, CreateForm} from "./Create";
import {SearchContextProvider, SearchInput, useSearchContext} from "./Search";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";


const style = {width: "100%"};

const Table = () => {
    const {columns, options: optionsFromConfig, url, searchFields, expandable} = useDomainContext()

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState<string | undefined>(undefined);
    const [sortDirection, setSortDirection] = useState(ESortDirection.DESC);
    const {searchValue} = useSearchContext()

    const offset = (currentPage - 1) * pageSize;

    const options: TCommonGetManyOptions = {
        ...optionsFromConfig,
        pagination: {limit: pageSize, offset},
    };


    if (sortField) {
        options.sort = {
            field: sortField,
            direction: sortDirection,
        };
    }

    const searchValueToSend = searchValue.trim();

    if (searchValueToSend) {
        options.where = {
            predicate: EPredicate.OR,
            operands: searchFields.map((field) => ({
                field,
                predicate: EOperandPredicate.LIKE,
                value: searchValueToSend,
            })),
        };
    }

    const {isFetching, data, error} = adminApi.useGetManyQuery({url, options})

    if (isFetching) {
        return <Skeleton/>
    }

    if (error) {
        return <Result status={404} title={"Ошибка при загрузке данных"} subTitle={JSON.stringify(error)}/>
    }

    const onChange: TableProps<IWithId>["onChange"] = (pagination, filters, sorter) => {
        if (pagination.current) {
            setCurrentPage(pagination.current);
        }

        if (pagination.pageSize) {
            setPageSize(pagination.pageSize);
        }

        const sort = Array.isArray(sorter) ? sorter[0] : sorter;

        if (sort) {
            setSortField(Array.isArray(sort.field) ? sort.field[0] : sort.field);
            setSortDirection(
                sort.order === "ascend" ? ESortDirection.ASC : ESortDirection.DESC,
            );
        }
    };

    const pagination = {
        current: currentPage,
        pageSize,
        total: data?.pagination.totalRows,
    }


    return (
        <AntTable
            pagination={pagination}
            onChange={onChange}
            style={style}
            rowKey={extractId}
            dataSource={data?.data}
            loading={isFetching}
            columns={columns}
            expandable={expandable}
        />
    );
};


const Page: FC<IDomain> = (props) => {
    return (
        <DomainContextProvider {...props}>
            <CreateContextProvider>
                <EditContextProvider>
                    <CreateForm/>
                    <EditDrawer/>
                    <Flex vertical gap={8}>
                        <SearchContextProvider>
                            <Flex justify={"space-between"} gap={8}>
                                <SearchInput/>
                                <CreateButton/>
                            </Flex>
                            <Table/>
                        </SearchContextProvider>
                    </Flex>
                </EditContextProvider>
            </CreateContextProvider>
        </DomainContextProvider>
    );
};

export {Page};
