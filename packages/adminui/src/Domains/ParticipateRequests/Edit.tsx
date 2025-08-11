import {Form, Input, Select, Switch} from "antd";
import {STATUS_OPTIONS} from "./StatusOptions";
import {EParticipateRequestStatus} from "@way-to-bot/shared/api/enums/EParticipateRequestStatus";

const options = STATUS_OPTIONS.filter((it) => it.value !== EParticipateRequestStatus.WAITING)

const EditParticipateRequest = () => {
    return <>
        <Form.Item name={"status"} label={"Статус"}>
            <Select options={options}/>
        </Form.Item>

        <Form.Item name={"message"} label={"Сообщение"}>
            <Input.TextArea/>
        </Form.Item>

        <Form.Item name={"notify"} label={"Оповестить пользователя"}>
            <Switch/>
        </Form.Item>
    </>;
};

export {EditParticipateRequest};