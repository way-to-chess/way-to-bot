import {FC} from "react";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {FilePlus2Icon} from "lucide-react";
import {Button, Drawer, Form, Select} from "antd";
import {useBoolean} from "@way-to-bot/shared/utils/UseBoolean";
import {adminApi} from "../../Store/AdminApi";
import {useDomainContext} from "../../Components/Domain";
import {EFileAssigment} from "@way-to-bot/shared/api/enums/EFileAssigment";
import {UploadFileInput} from "../../Components/UploadFileInput";

const EventLeagueSelect: FC<IWithId> = ({id}) => {
    const {url} = useDomainContext()

    const {data, isLoading} = adminApi.useGetOneQuery({url, id})

    return <Select loading={isLoading}/>
}

const FILE_TYPE_OPTIONS = [
    {
        value: EFileAssigment.SS_SCV,
        label: "Swiss System",
    },
    {
        value: EFileAssigment.CR_SCV,
        label: "Chess Results",
    },
];

const UploadResultsFileInput = () => {
    const assigment = Form.useWatch("assigment");

    return <UploadFileInput assigment={assigment} accept={"text/csv"}/>
}


const SubmitResults: FC<IWithId> = ({id}) => {
    const [open, {setFalse, setTrue}] = useBoolean()

    const [trigger, {isLoading}] = adminApi.useCreateMutation()

    const onFinish = ({eventLeagueId, fileId}: {
        fileId: string,
        assigment: EFileAssigment,
        eventLeagueId: number
    }) => {
        trigger({url: `file/import/csv/${eventLeagueId}`, payload: {fileId}})
    }

    return <>
        <Drawer open={open} onClose={setFalse} width={720} title={"Загрузить результаты"} destroyOnHidden>
            <Form layout={"vertical"} requiredMark={"optional"} onFinish={onFinish} disabled>
                <Form.Item name={"eventLeagueId"} label={"Лига События"}>
                    <EventLeagueSelect id={id}/>
                </Form.Item>
                <Form.Item name={"assigment"} label={"Тип файла"}>
                    <Select options={FILE_TYPE_OPTIONS}/>
                </Form.Item>
                <Form.Item name={"file"} valuePropName={"fileList"}>
                    <UploadResultsFileInput/>
                </Form.Item>
                <Form.Item style={{float: "right"}}>
                    <Button htmlType={"submit"} type={"primary"} loading={isLoading}>
                        {"Сохранить"}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
        <Button
            disabled
            onClick={setTrue}
            icon={<FilePlus2Icon size={16}/>}
            type={"text"}
        />
    </>

}

export {SubmitResults}