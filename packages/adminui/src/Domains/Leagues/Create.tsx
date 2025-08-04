import {Form, Input} from "antd";


const CreateLeague = () => {

    return <Form.Item name={"name"} label={"Название"}>
        <Input placeholder={"Название лиги"}/>
    </Form.Item>
};

export {CreateLeague};