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
    Popconfirm,
    Row,
    Select,
    SelectProps,
    Space,
    Table,
    TableProps,
    Upload,
    UploadFile,
    UploadProps
} from "antd";
import {eventApi} from "../../Store/Event/EventApi";
import {extractId} from "../../Utils/Extract";
import {AdminDTOEventGetMany} from "@way-to-bot/shared/api/DTO/admin/event.DTO";
import {EEventStatus, ESortDirection} from "@way-to-bot/shared/api/enums/index";
import {LocationSelect} from "../Locations/LocationSelect";
import {UserSelect} from "../Users/UserSelect";
import {TAdminEventCreatePayload} from "@way-to-bot/shared/api/zod/admin/event.schema";
import dayjs, {Dayjs} from "dayjs"
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {EditIcon, PlusIcon, TrashIcon} from "lucide-react";
import {IFileEntity} from "@way-to-bot/shared/api/interfaces/entities/file-entity.interface";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";

const requiredRule = {required: true, message: 'Обязательное поле'}

type TUploadProps = Omit<UploadProps, "accept" | "action" | "method" | "listType" | "style" | "onChange"> & {
    onChange?: (fileList: UploadFile[]) => void
}

const UploadImage: FC<TUploadProps> = ({onChange: onChangeFromProps, ...props}) => {
    const [hideInput, setHideInput] = useState(props.fileList && props.fileList?.length > 0)

    const onChange: UploadProps["onChange"] = (info) => {
        const {status} = info.file;

        if (status === "uploading") {
            setHideInput(true)
        }

        if (status === 'done') {
            setHideInput(true)
            message.success(`${info.file.name} успешно загружен`);
        }
        if (status === 'error') {
            setHideInput(false)
            message.error(`${info.file.name} ошибка загрузки`);
        }
        if (status === 'removed') {
            setHideInput(false)
        }

        onChangeFromProps?.(info.fileList)
    }

    const action = `${import.meta.env.VITE_API_URL}/client/file`

    return <Upload accept={"image/*"} action={action} method={"POST"} listType={"picture"}
                   onChange={onChange} style={{width: "100%"}} {...props}>
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
    file: UploadFile[],
    dateTime: [Dayjs, Dayjs | null]
}

interface IFormProps {
    onFinish: (values: IFormValues) => void
    initialValues: Partial<IFormValues>
    isLoading: boolean
    submitTitle: string
}


const convertFileToFileList = (file: IFileEntity) => {
    return [{
        uid: String(file.id),
        name: file.url ? String(file.url.split("/").at(-2)) : "",
        status: "done" as const,
        url: getPreviewSrc(file.url),
        thumbUrl: getPreviewSrc(file.previewUrl),
    }]
}


const BaseForm: FC<IFormProps> = ({isLoading, initialValues, onFinish, submitTitle}) => {
    return <Form layout={"vertical"} requiredMark={"optional"} onFinish={onFinish} initialValues={initialValues}>
        <Form.Item name={"file"} valuePropName={"fileList"}>
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
                        allowEmpty={[false, true]}
                        showTime
                        disabled={isLoading}
                        style={{width: '100%'}} getPopupContainer={(trigger) => trigger.parentElement!}/>
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name={"price"} label={"Цена участия"} rules={[requiredRule]}>
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
                <Form.Item name={"status"} label={"Статус"}>
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
                {submitTitle}
            </Button>
        </Form.Item>
    </Form>
}

const getFileId = (file?: UploadFile) => file ? file?.response?.data.id ?? Number(file.uid) : null

const CreateForm: FC<{ onClose: VoidFunction }> = ({onClose}) => {
    const [create, {isLoading,}] = eventApi.useCreateEventMutation()

    const onFinish = ({dateTime, file, participantsLimit, ...rest}: IFormValues) => {
        const duration = dateTime[1] ? dateTime[1].diff(dateTime[0]) : null

        create({
            fileId: getFileId(file[0]),
            dateTime: dateTime[0].toDate(),
            duration,
            participantsLimit: isNaN(Number(participantsLimit)) ? 0 : Number(participantsLimit),
            ...rest
        }).unwrap().then(() => {
            message.success(`Событие ${rest.name} успешно создано`)
            onClose()
        }).catch((err) => {
            message.error(JSON.stringify(err))
        })
    }

    return <BaseForm isLoading={isLoading} initialValues={{status: EEventStatus.WAITING}} onFinish={onFinish}
                     submitTitle={"Создать"}/>
}

const EditForm: FC<Omit<AdminDTOEventGetMany, "countParticipants"> & { onClose: VoidFunction }> = (
    {
        participantsLimit,
        name,
        dateTime,
        duration,
        price,
        status,
        location,
        description,
        host,
        linkToStream,
        preview,
        id,
        onClose
    }) => {

    const [update, {isLoading}] = eventApi.useUpdateEventMutation()

    const initialValues: IFormValues = {
        file: preview ? convertFileToFileList(preview) : [],
        participantsLimit,
        name,
        dateTime: [dayjs(dateTime), duration ? dayjs(dateTime).add(duration, "milliseconds") : null],
        price,
        status,
        locationId: location?.id,
        description,
        hostId: host?.id,
        linkToStream
    }

    const onFinish = ({dateTime, file, participantsLimit, ...rest}: IFormValues) => {
        const duration = dateTime[1] ? dateTime[1].diff(dateTime[0]) : null

        update({
            id,
            fileId: getFileId(file[0]),
            duration,
            participantsLimit: isNaN(Number(participantsLimit)) ? 0 : Number(participantsLimit),
            ...rest
        }).unwrap().then(() => {
            message.success(`Событие ${rest.name} успешно изменено`)
            onClose()
        }).catch((err) => {
            message.error(JSON.stringify(err))
        })
    }

    return <BaseForm isLoading={isLoading} initialValues={initialValues} onFinish={onFinish} submitTitle={"Изменить"}/>
}

const EditButton: FC<AdminDTOEventGetMany> = (props) => {
    const [open, setOpen] = useState(false)

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return <>
        <Drawer title={"Изменить событие"} open={open} onClose={onClose} width={720}>
            <EditForm onClose={onClose}  {...props}/>
        </Drawer>
        <Button icon={<EditIcon size={16} color={"var(--ant-color-primary)"}/>} type={"text"} onClick={showDrawer}/>
    </>
}

const DeleteButton: FC<IWithId> = ({id}) => {
    const [trigger, {isLoading}] = eventApi.useDeleteEventMutation()

    const onConfirm = () => trigger({id})

    return <Popconfirm
        title={"Удалить?"}
        okText={"Да"}
        cancelText={"Нет"}
        onConfirm={onConfirm}
    >
        <Button icon={<TrashIcon size={16}/>} danger loading={isLoading} type={"text"}/>
    </Popconfirm>
}

const COLUMNS: TableProps<AdminDTOEventGetMany>["columns"] = [
    {
        title: "Название",
        dataIndex: "name"
    },
    {
        title: "Действия",
        width: 100,
        render: (props) => <Space.Compact>
            <EditButton {...props} />
            <DeleteButton id={props.id}/>
        </Space.Compact>
    }
];

const EventsTable = () => {
    const {data, isFetching} = eventApi.useGetAllEventsQuery({
        sort: {
            field: "createdAt",
            direction: ESortDirection.DESC
        }
    })
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
                <Button style={{width: "fit-content", alignSelf: "end",}} type={"primary"} onClick={showDrawer}
                        icon={<PlusIcon size={14}/>}>
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
