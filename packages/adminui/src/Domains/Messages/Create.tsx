import {Form, Input, Radio} from "antd";
import {REQUIRED_RULE} from "../../Utils/WithRequiredRule";
import {UserTransfer} from "../Users/UserTransfer";

const UserIds = () => {
    const type = Form.useWatch("type");

    return type === "PICK" ? (
        <Form.Item
            name={"userIds"}
            rules={REQUIRED_RULE}
            valuePropName={"targetKeys"}
        >
            <UserTransfer/>
        </Form.Item>
    ) : null;
};

const CreateMessage = () => {
    return <>
        <Form.Item name={"type"} rules={REQUIRED_RULE} initialValue={"ALL"}>
            <Radio.Group
                options={[
                    {value: "ALL", label: "Для всех"},
                    {value: "PICK", label: "Выбрать из списка"},
                ]}
            />
        </Form.Item>

        <UserIds/>

        <Form.Item name={"message"} label={"Сообщение"} rules={REQUIRED_RULE}>
            <Input.TextArea rows={4}/>
        </Form.Item>
    </>
};

export {CreateMessage};