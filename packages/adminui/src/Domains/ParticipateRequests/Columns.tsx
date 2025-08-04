import {AdminDTOParticipateRequestGetMany} from "@way-to-bot/shared/api/DTO/admin/participate-request.DTO";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {Flex, TableProps, Typography} from "antd";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import {CircleDollarSignIcon, CreditCardIcon, PaperclipIcon} from "lucide-react";
import dayjs from "dayjs";
import {STATUS_OPTIONS} from "./StatusOptions";

const DATE_TIME_FORMAT = "HH:MM DD/MM/YYYY";

const COLUMNS: TableProps<AdminDTOParticipateRequestGetMany>["columns"] = [
    {
        title: "Пользователь",
        render: (_, {user}) => (
            <Flex vertical>
                <Typography.Text>
                    {getUserFullName(user.firstName, user.lastName)}
                </Typography.Text>
                <Typography.Text type={"secondary"}>{user.username}</Typography.Text>
            </Flex>
        ),
    },
    {title: "Событие", render: (_, {event}) => event.name},
    {
        title: "Способ оплаты",
        render: (_, {paymentType}) => {
            if (paymentType === EParticipateRequestPaymentType.CASH) {
                return <CircleDollarSignIcon width={16} height={16}/>;
            }

            if (paymentType === EParticipateRequestPaymentType.RECEIPT) {
                return <PaperclipIcon width={16} height={16}/>;
            }

            return <CreditCardIcon width={16} height={16}/>;
        },
        align: "center",
    },
    {
        title: "Статус",
        render: (_, {status}) => STATUS_OPTIONS.find((it) => it.value === status)?.label,
    },
    {
        title: "Дата создания",
        render: ({createdAt}) => dayjs(createdAt).format(DATE_TIME_FORMAT),
    },
];

export {COLUMNS}