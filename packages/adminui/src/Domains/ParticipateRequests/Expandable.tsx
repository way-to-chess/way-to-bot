import {AdminDTOParticipateRequestGetMany} from "@way-to-bot/shared/api/DTO/admin/participate-request.DTO";
import {Descriptions, Flex, TableProps, Typography} from "antd";
import dayjs from "dayjs";
import {EParticipateRequestPaymentType} from "@way-to-bot/shared/api/enums/EParticipateRequestPaymentType";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {FC} from "react";
import {adminApi} from "../../Store/AdminApi";
import {AdminDTOEventGetOne} from "@way-to-bot/shared/api/DTO/admin/event.DTO";

const PAYMENT_TYPE_NAME_MAP: Record<EParticipateRequestPaymentType, string> = {
    [EParticipateRequestPaymentType.CASH]: "Наличными",
    [EParticipateRequestPaymentType.RECEIPT]: "Банковский перевод",
    [EParticipateRequestPaymentType.ONLINE]: "Онлайн"
}

const EventLeague: FC<{ eventId: number, elIds: number[] }> = ({eventId, elIds = []}) => {

    const {data: event, isFetching} = adminApi.useGetOneQuery({url: "event", id: eventId})

    if (isFetching) {
        return "..."
    }


    return (event as AdminDTOEventGetOne)?.eventLeagues.filter(({id}) => elIds.includes(id)).map(({name}) => name).join(", ")

}

const EXPANDABLE_CONFIG: TableProps<AdminDTOParticipateRequestGetMany>["expandable"] = {
    expandRowByClick: true,
    expandedRowRender: ({paymentType, receipt, message, additionalUsers, eventId}) => {

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
                            {
                                user.city ?
                                    <Descriptions.Item
                                        label={"Город"}>{user.city}</Descriptions.Item> :
                                    null
                            }
                            {
                                user.club ?
                                    <Descriptions.Item
                                        label={"Клуб"}>{user.club}</Descriptions.Item> :
                                    null
                            }

                            <Descriptions.Item label={"Турнир/Турниры"}>
                                <EventLeague eventId={eventId} elIds={user.elIds}/>
                            </Descriptions.Item>


                            <Descriptions.Item
                                label={"Способ оплаты"}>{PAYMENT_TYPE_NAME_MAP[paymentType]}</Descriptions.Item>

                            {paymentType === EParticipateRequestPaymentType.RECEIPT ? (
                                <Descriptions.Item
                                    label={"Подтверждение оплаты"}><Typography.Link
                                    href={getPreviewSrc(receipt?.url)}
                                    target={"_blank"}
                                    rel="noreferrer"
                                >
                                    {"Показать файл"}
                                </Typography.Link></Descriptions.Item>

                            ) : null}

                            {message ?
                                < Descriptions.Item label={"Сообщене организатора"}>{message}</Descriptions.Item> : null}

                        </Descriptions>
                    )
                }

            </Flex>
        );
    },
};

export {EXPANDABLE_CONFIG}