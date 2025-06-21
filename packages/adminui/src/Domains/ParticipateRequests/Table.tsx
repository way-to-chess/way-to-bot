import {memo, useState} from "react";
import {
    Badge,
    Button,
    Drawer,
    Flex,
    Form,
    Input,
    message,
    Select,
    SelectProps,
    Table,
    TableProps,
    Typography
} from "antd";
import {TEXT} from "@way-to-bot/shared/constants/text";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import type {ExpandableConfig} from "rc-table/lib/interface";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import dayjs from "dayjs";
import {participateRequestApi} from "../../Store/ParticipateRequest/ParticipateRequestApi";
import {
    AdminDTOParticipateRequestGetMany,
    AdminDTOParticipateRequestGetOne
} from "@way-to-bot/shared/api/DTO/admin/participate-request.DTO";
import {
    EParticipateRequestPaymentType,
    EParticipateRequestStatus,
    ESortDirection
} from "@way-to-bot/shared/api/enums/index";
import {TAdminParticipateRequestUpdatePayload} from "@way-to-bot/shared/api/zod/admin/participate-request.schema";

const DATE_TIME_FORMAT = "HH:MM DD/YYYY";

const options: SelectProps["options"] = [
    {
        value: EParticipateRequestStatus.APPROVED,
        label: <Badge offset={[4, 0]} status={"success"} text={"Подтверждена"}/>
    },
    {
        value: EParticipateRequestStatus.REJECTED,
        label: <Badge offset={[4, 0]} status={"error"} text={"Отклонена"}/>
    },
    {
        value: EParticipateRequestStatus.WAITING,
        label: <Badge offset={[4, 0]} status={"processing"} text={"На рассмотрении"}/>
    }
]

const COLUMNS: TableProps<AdminDTOParticipateRequestGetMany>["columns"] = [
    {
        title: TEXT.user,
        render: (_, {user}) => (
            <Flex vertical>
                <Typography.Text>
                    {getUserFullName(user.firstName, user.lastName)}
                </Typography.Text>
                <Typography.Text type={"secondary"}>{user.username}</Typography.Text>
            </Flex>
        ),
    },
    {title: TEXT.event, render: (_, {event}) => event.name},
    {
        title: TEXT.status,
        render: (_, {status}) => options.find((it) => it.value === status)?.label
    },
    {
        title: TEXT.createdAt,
        render: ({createdAt}) => dayjs(createdAt).format(DATE_TIME_FORMAT),
    },
];


const Edit = memo(({id, status}: Pick<AdminDTOParticipateRequestGetOne, "status" | "id">) => {
    const [approve, {isLoading}] = participateRequestApi.useUpdateParticipateRequestMutation();

    const [open, setOpen] = useState(false)

    const onClose = () => setOpen(false)

    const onOpen = () => setOpen(true)

    const onFinish = (values: TAdminParticipateRequestUpdatePayload) => {
        approve({id, ...values}).unwrap().then(() => {
            message.success("Заявка обновлена")
            setOpen(false)
        }).catch(() => {
            message.error("Ошибка при отпавке зароса")
        })
    }

    return <>
        <Button loading={isLoading} onClick={onOpen} type={"primary"}>{"Обновить"}</Button>
        <Drawer open={open} onClose={onClose} title={"Обновить заявку"}>
            <Form layout={"vertical"} onFinish={onFinish}>
                <Form.Item name={"status"} label={"Статус"} initialValue={status}>
                    <Select options={options}/>
                </Form.Item>

                <Form.Item name={"message"} label={"Сообщение"}>
                    <Input.TextArea/>
                </Form.Item>

                <Form.Item style={{float: "right"}}>
                    <Button type={"primary"} htmlType={"submit"}>
                        {"Обновить"}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    </>
});

const EXPANDABLE_CONFIG: ExpandableConfig<AdminDTOParticipateRequestGetMany> = {
    expandRowByClick: true,
    expandedRowRender: ({paymentType, id, receipt, status,}) => {
        return (
            <Flex align={"center"} justify={"space-between"}>
                {paymentType === EParticipateRequestPaymentType.RECEIPT ?
                    <Typography.Link
                        href={getPreviewSrc(receipt?.previewUrl)}
                        target={"_blank"}
                        rel="noreferrer"
                    >
                        {TEXT.showFile}
                    </Typography.Link> : null

                }

                {paymentType === EParticipateRequestPaymentType.CASH ?
                    <Typography.Text>
                        {"Оплата наличными на месте"}
                    </Typography.Text> : null
                }

                <Edit id={id} status={status}/>
            </Flex>
        );
    },
};

const getRowKey = (request: AdminDTOParticipateRequestGetMany) => request.id;

const ParticipateRequestsTable = () => {
    const {data, isFetching} = participateRequestApi.useGetAllParticipateRequestsQuery({
        sort: {
            field: "createdAt",
            direction: ESortDirection.DESC
        }
    });

    return (
        <Table
            style={{width: "100%"}}
            rowKey={getRowKey}
            dataSource={data?.data}
            loading={isFetching}
            columns={COLUMNS}
            pagination={false}
            expandable={EXPANDABLE_CONFIG}
        />
    );
};

export {ParticipateRequestsTable};
