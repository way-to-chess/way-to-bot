import {Badge, SelectProps} from "antd";
import {EParticipateRequestStatus} from "@way-to-bot/shared/api/enums/EParticipateRequestStatus";

const STATUS_OPTIONS: NonNullable<SelectProps["options"]> = [
    {
        value: EParticipateRequestStatus.APPROVED,
        label: <Badge offset={[4, 0]} status={"success"} text={"Подтверждена"}/>,
    },
    {
        value: EParticipateRequestStatus.REJECTED,
        label: <Badge offset={[4, 0]} status={"error"} text={"Отклонена"}/>,
    },
    {
        value: EParticipateRequestStatus.WAITING,
        label: (
            <Badge offset={[4, 0]} status={"processing"} text={"На рассмотрении"}/>
        ),
        disabled: true
    },
];

export {STATUS_OPTIONS}