import {useState} from "react";
import {Button, Drawer, Flex, Form, Table, TableProps} from "antd";
import {eventApi} from "../../Store/Event/EventApi";
import {extractId} from "../../Utils/Extract";
import {AdminDTOEventGetMany} from "@way-to-bot/shared/api/DTO/admin/event.DTO";

const COLUMNS: TableProps<AdminDTOEventGetMany>["columns"] = [
    {
        title: "Название",
        dataIndex: "name"
    },
];

const EventsTable = () => {
    const {data, isFetching} = eventApi.useGetAllEventsQuery({})
    const [open, setOpen] = useState(false)

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const extra = (
        <Button onClick={onClose} type={"primary"}>
            {"Создать"}
        </Button>
    )

    return (

        <>
            <Drawer title={"Создать новое событие"} open={open} onClose={onClose} extra={extra}>
                <Form>

                </Form>
            </Drawer>
            <Flex vertical gap={8}>
                <Button style={{width: "fit-content", alignSelf: "end"}} type={"primary"} onClick={showDrawer}>
                    {"Создать"}
                </Button>
                <Table
                    style={{width: "100%"}}
                    rowKey={extractId}
                    dataSource={data?.data}
                    loading={isFetching}
                    columns={COLUMNS}
                    pagination={false}
                />
            </Flex>
        </>
    );
};

export {EventsTable};
