import {Form, Input, Select, Switch} from "antd";
import {STATUS_OPTIONS} from "./StatusOptions";

const EditParticipateRequest = () => {
    return <>
        <Form.Item name={"status"} label={"Статус"}>
            <Select options={STATUS_OPTIONS}/>
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