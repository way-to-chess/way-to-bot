import {Form, Input} from "antd";


const EditLeague = () => {

    return <Form.Item name={"name"} label={"Название"}>
        <Input placeholder={"Название лиги"}/>
    </Form.Item>
};

export {EditLeague};