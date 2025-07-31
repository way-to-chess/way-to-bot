import {Button, Drawer, Form, message} from "antd";
import {PlusIcon} from "lucide-react";
import {useBoolean} from "@way-to-bot/shared/utils/UseBoolean";
import {createContext, FC, PropsWithChildren, useContext} from "react";
import {useDomainContext} from "./Domain";
import {adminApi} from "../Store/AdminApi";

type ICreateContext = ReturnType<typeof useBoolean>;

const CreateContext = createContext<ICreateContext | null>(null);

const CreateContextProvider: FC<PropsWithChildren> = ({children}) => {
    const value = useBoolean();

    return (
        <CreateContext.Provider value={value}>{children}</CreateContext.Provider>
    );
};

const useCreateContext = () => {
    const context = useContext(CreateContext);

    if (!context) {
        throw new Error("Try to use Create context without provider");
    }

    return context;
};

const CreateForm = () => {
    const {create: {title, definition, normalize, initialValues, url: createUrl}, url} = useDomainContext()
    const [create, {isLoading}] = adminApi.useCreateMutation();
    const [open, {setFalse}] = useCreateContext();
    const form = Form.useFormInstance()

    const onFinish = (values: unknown) => {
        create({url: createUrl || url, payload: normalize ? normalize(values) : values})
            .unwrap()
            .then(() => {
                message.success("Успешно создано");
                setFalse();
            })
            .catch((err) => {
                console.log(err, 123)
                message.error(JSON.stringify(err));
            });
    }
    return <Drawer title={title} open={open} onClose={setFalse} width={720}>
        <Form
            form={form}
            onFinish={onFinish}
            disabled={isLoading}
            layout={"vertical"}
            requiredMark={"optional"}
            initialValues={initialValues}>

            {definition}

            <Form.Item style={{float: "right"}}>
                <Button htmlType={"submit"} type={"primary"} loading={isLoading}>
                    {"Создать"}
                </Button>
            </Form.Item>
        </Form>
    </Drawer>
}

const CreateButton = () => {
    const [_, {setTrue}] = useCreateContext();
    const {create: {definition}} = useDomainContext()

    if (definition === null) {
        return null
    }

    return (
        <Button
            style={{width: "fit-content", alignSelf: "end"}}
            type={"primary"}
            onClick={setTrue}
            icon={<PlusIcon size={14}/>}
        >
            {"Создать"}
        </Button>
    );
};

export {CreateButton, CreateContextProvider, CreateForm}