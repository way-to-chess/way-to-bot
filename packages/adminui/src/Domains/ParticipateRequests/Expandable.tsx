import {AdminDTOParticipateRequestGetMany} from "@way-to-bot/shared/api/DTO/admin/participate-request.DTO";
import {Descriptions, Flex, TableProps, Typography} from "antd";
import dayjs from "dayjs";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";

const PAYMENT_TYPE_NAME_MAP: Record<EParticipateRequestPaymentType, string> = {
    [EParticipateRequestPaymentType.CASH]: "Наличными",
    [EParticipateRequestPaymentType.RECEIPT]: "Банковский перевод",
    [EParticipateRequestPaymentType.ONLINE]: "Онлайн"
}

const EXPANDABLE_CONFIG: TableProps<AdminDTOParticipateRequestGetMany>["expandable"] = {
    expandRowByClick: true,
    expandedRowRender: ({paymentType, receipt, message, additionalUsers}) => {

        return (
            <Flex vertical gap={20}>
                {
                    additionalUsers.map((user, index) => <Descriptions layout={"vertical"} key={index}
                                                                       title={`Участник ${index + 1}`}>
                            <Descriptions.Item label={"Имя"}>{user.firstName}</Descriptions.Item>
                            <Descriptions.Item label={"Фамилия"}>{user.lastName}</Descriptions.Item>
                            {
                                user.birthDate ?
                                    <Descriptions.Item
                                        label={"Дата рождения"}>{dayjs(user.birthDate).format("DD/MM/YYYY")}</Descriptions.Item> :
                                    null
                            }
                            {
                                user.email ?
                                    <Descriptions.Item
                                        label={"Эл. Почта"}>{user.email}</Descriptions.Item> :
                                    null
                            }
                            {
                                user.phoneNumber ?
                                    <Descriptions.Item
                                        label={"Номер телефона"}>{`+375${user.phoneNumber}`}</Descriptions.Item> :
                                    null
                            }
                            {
                                user.level ?
                                    <Descriptions.Item
                                        label={"Уровень игры"}>{user.level}</Descriptions.Item> :
                                    null
                            }
                            <Descriptions.Item
                                label={"Способ оплаты"}>{PAYMENT_TYPE_NAME_MAP[paymentType]}</Descriptions.Item> :
                        </Descriptions>
                    )
                }

                <Flex align={"center"} justify={"space-between"}>
                    {message ? <Typography.Text>{message}</Typography.Text> : null}

                    {paymentType === EParticipateRequestPaymentType.RECEIPT ? (
                        <Typography.Link
                            href={getPreviewSrc(receipt?.url)}
                            target={"_blank"}
                            rel="noreferrer"
                        >
                            {"Показать файл"}
                        </Typography.Link>
                    ) : null}
                </Flex>
            </Flex>
        );
    },
};

export {EXPANDABLE_CONFIG}