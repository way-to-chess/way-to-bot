import {Form, Input, Select} from "antd";
import {STATUS_OPTIONS} from "./StatusOptions";

const EditParticipateRequest = () => {
    return <>
        <Form.Item name={"status"} label={"Статус"}>
            <Select options={STATUS_OPTIONS}/>
        </Form.Item>

        <Form.Item name={"message"} label={"Сообщение"}>
            <Input.TextArea/>
        </Form.Item>
    </>;
};

export {EditParticipateRequest};