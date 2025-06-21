import {FC, useState} from "react";
import {
    Badge,
    BadgeProps,
    Button,
    Col,
    DatePicker,
    Drawer,
    Flex,
    Form,
    Input,
    message,
    Row,
    Select,
    SelectProps,
    Table,
    TableProps,
    Upload,
    UploadProps
} from "antd";
import {eventApi} from "../../Store/Event/EventApi";
import {extractId} from "../../Utils/Extract";
import {AdminDTOEventGetMany} from "@way-to-bot/shared/api/DTO/admin/event.DTO";
import {EEventStatus} from "@way-to-bot/shared/api/enums/index";
import {LocationSelect} from "../Locations/LocationSelect";
import {UserSelect} from "../Users/UserSelect";
import {TAdminEventCreatePayload} from "@way-to-bot/shared/api/zod/admin/event.schema";
import {Dayjs} from "dayjs"
import {UploadFile} from "antd/es/upload/interface";
import {ClientDTOFileCreateResponse} from "@way-to-bot/shared/api/DTO/client/file.DTO";

const requiredRule = {required: true, message: 'Обязательное поле'}

type TUploadProps = Omit<UploadProps, "accept" | "action" | "method" | "listType" | "onChange" | "style">

const UploadImage: FC<TUploadProps> = (props) => {
    const [hideInput, setHideInput] = useState(false)

    const onChange: UploadProps["onChange"] = (info) => {
        const {status} = info.file;

        if (status === "uploading") {
            setHideInput(true)
        }
        if (status === 'done') {
            setHideInput(true)
            info.file.response.data.id
            message.success(`${info.file.name} успешно загружен`);
        }
        if (status === 'error') {
            setHideInput(false)

            message.error(`${info.file.name} ошибка загрузки`);
        }
        if (status === 'removed') {
            setHideInput(false)
        }
    }

    const action = `${import.meta.env.VITE_API_URL}/client/file`

    return <Upload accept={"image/*"} action={action} method={"POST"} listType={"picture"}
                   onChange={onChange} style={{width: "100%"}}  {...props}>
        {hideInput ? null :
            <Button style={{width: "100%"}} type={"dashed"} size={"large"}>{"Загрузить изображение"}</Button>}
    </Upload>
}

const STATUS_OPTIONS: SelectProps["options"] = [
    {
        value: EEventStatus.WAITING,
        label: "Ожидает"
    },
    {
        value: EEventStatus.STARTED,
        label: "Начался"
    },
    {
        value: EEventStatus.FINISHED,
        label: "Закончился"
    }
]

const STATUS_MAP: Record<string, BadgeProps["status"]> = {
    [EEventStatus.FINISHED]: "default",
    [EEventStatus.WAITING]: "warning",
    [EEventStatus.STARTED]: "processing"
}

const optionRender: SelectProps["optionRender"] = ({label, value}) =>
    <Badge status={STATUS_MAP[String(value)]} text={label} offset={[4, 0]}/>

const labelRender: SelectProps["labelRender"] = ({label, value}) =>
    <Badge status={STATUS_MAP[String(value)]} text={label} offset={[4, 0]}/>

interface IFormValues extends Omit<TAdminEventCreatePayload, "dateTime" | "fileId" | "duration"> {
    file: {
        file: UploadFile<ClientDTOFileCreateResponse>,
    }
    dateTime: [Dayjs, Dayjs]
}

const CreateForm: FC<{ onClose: VoidFunction }> = ({onClose}) => {
    const [create, {isLoading,}] = eventApi.useCreateEventMutation()

    const onFinish = ({dateTime, file, participantsLimit, ...rest}: IFormValues) => {
        const fileId = file?.file.response?.data.id

        const duration = dateTime[1].diff(dateTime[0])

        create({
            fileId,
            dateTime: dateTime[0].toDate(),
            duration,
            participantsLimit: Number(participantsLimit),
            ...rest
        }).unwrap().then(() => {
            message.success(`Событие ${rest.name} успешно создано`)
            onClose()
        }).catch((err) => {
            message.error(JSON.stringify(err))
        })

    }

    return <Form layout={"vertical"} requiredMark={"optional"} onFinish={onFinish}>
        <Form.Item name={"file"}>
            <UploadImage disabled={isLoading}/>
        </Form.Item>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name={"name"} label={"Название"} rules={[requiredRule]}>
                    <Input placeholder={"Название события"} disabled={isLoading}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name={"dateTime"} label={"Дата и время"} rules={[requiredRule]}>
                    <DatePicker.RangePicker
                        showTime
                        disabled={isLoading}
                        style={{width: '100%'}} getPopupContainer={(trigger) => trigger.parentElement!}/>
                </Form.Item>

            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name={"price"} label={"Цена участия"}>
                    <Input disabled={isLoading} style={{width: '100%'}} placeholder={"Бесплатно"}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name={"participantsLimit"} label={"Количество участников"}>
                    <Input disabled={isLoading} style={{width: '100%'}} type={"number"} placeholder={"0"}/>
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name={"status"} label={"Статус"} initialValue={EEventStatus.WAITING}>
                    <Select disabled={isLoading} optionRender={optionRender} options={STATUS_OPTIONS}
                            labelRender={labelRender}/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name={"linkToStream"} label={"Ссылка на трансляцию"}>
                    <Input disabled={isLoading} style={{width: '100%'}} placeholder={"https://youtube.com"}/>
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name={"locationId"} label={"Локация"} rules={[requiredRule]}>
                    <LocationSelect disabled={isLoading}/>
                </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name={"hostId"} label={"Ораганизатор"} rules={[requiredRule]}>
                    <UserSelect disabled={isLoading}/>
                </Form.Item>
            </Col>
        </Row>

        <Row gutter={16}>
            <Col span={24}>
                <Form.Item name={"description"} label={"Описание"}>
                    <Input.TextArea disabled={isLoading} rows={4}/>
                </Form.Item>
            </Col>
        </Row>

        <Form.Item style={{float: "right"}}>
            <Button htmlType={"submit"} type={"primary"} loading={isLoading}>
                {"Создать"}
            </Button>
        </Form.Item>
    </Form>
}

const COLUMNS: TableProps<AdminDTOEventGetMany>["columns"] = [
    {
        title: "Название",
        dataIndex: "name"
    },
];

const EventsTable = () => {
    const {data, isFetching} = eventApi.useGetAllEventsQuery({})
    const [open, setOpen] = useState(false)

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Drawer title={"Создать новое событие"} open={open} onClose={onClose} width={720}>
                <CreateForm onClose={onClose}/>
            </Drawer>
            <Flex vertical gap={8}>
                <Button style={{width: "fit-content", alignSelf: "end",}} type={"primary"} onClick={showDrawer}>
                    {"Создать"}
                </Button>
                <Table
                    style={{width: "100%"}}
                    rowKey={extractId}
                    dataSource={data?.data}
                    loading={isFetching}
                    columns={COLUMNS}
                    pagination={false}
                />
            </Flex>
        </>
    );
};

export {EventsTable};
