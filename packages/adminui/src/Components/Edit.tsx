import {createContext, FC, memo, PropsWithChildren, useCallback, useContext, useState} from "react";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {Button, Drawer, Form, message, Skeleton} from "antd";
import {EditIcon} from "lucide-react";
import {useDomainContext} from "./Domain";
import {adminApi} from "../Store/AdminApi";

interface IEditContext {
    id: number | null
    clearId: VoidFunction
    setId: (id: number) => void
}

const EditContext = createContext<IEditContext | null>(null);

const useEditContext = () => {
    const context = useContext(EditContext);

    if (!context) {
        throw new Error("Try to use Edit context without provider");
    }

    return context;
}

const EditContextProvider: FC<PropsWithChildren> = ({children}) => {
    const [id, setId] = useState<number | null>(null)

    const clearId = useCallback(() => {
        setId(null)
    }, [])

    const value: IEditContext = {
        id,
        clearId,
        setId,
    }

    return <EditContext.Provider value={value}>
        {children}
    </EditContext.Provider>
}


const EditButton = memo<IWithId>(({id}) => {
    const {setId} = useEditContext()

    const onClick = () => {
        setId(id)
    }

    return <Button onClick={onClick} icon={<EditIcon size={16} color={"var(--ant-color-primary)"}/>} type={"text"}/>
});

const EditForm: FC<IWithId> = ({id}) => {
    const {url, edit: {definition, normalize, getInitialValues}} = useDomainContext()
    const {clearId} = useEditContext()

    const {data} = adminApi.useGetOneQuery({url, id})

    const [update, {isLoading}] = adminApi.useUpdateMutation()

    const onFinish = (values: unknown) => {
        update({url, id, payload: normalize ? normalize(values) : values})
            .unwrap()
            .then(() => {
                message.success(`Успешно изменено`);
                clearId();
            })
            .catch((err) => {
                message.error(JSON.stringify(err));
            });
    };

    const initialValues = data ? getInitialValues(data) : undefined

    if (!initialValues) {
        return <Skeleton/>
    }

    return <Form onFinish={onFinish} disabled={isLoading} layout={"vertical"} requiredMark={"optional"}
                 initialValues={initialValues}>
        {definition}

        <Form.Item style={{float: "right"}}>
            <Button htmlType={"submit"} type={"primary"} loading={isLoading}>
                {"Сохранить"}
            </Button>
        </Form.Item>
    </Form>
}

const EditDrawer = () => {
    const {id, clearId} = useEditContext()
    const {edit: {title}} = useDomainContext()

    return <Drawer title={title} open={!!id} onClose={clearId} width={720}>
        {id ? <EditForm id={id}/> : null}
    </Drawer>
}


export {EditButton, EditContextProvider, EditDrawer}