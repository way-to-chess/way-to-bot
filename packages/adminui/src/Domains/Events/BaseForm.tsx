import {Badge, BadgeProps, Col, DatePicker, Form, Input, Row, Select, SelectProps, UploadFile} from "antd";
import {LocationSelect} from "../Locations/LocationSelect";
import {UserSelect} from "../Users/UserSelect";
import {TAdminEventCreatePayload} from "@way-to-bot/shared/api/zod/admin/event.schema";
import {Dayjs} from "dayjs";
import {REQUIRED_RULE} from "../../Utils/WithRequiredRule";
import {EEventStatus} from "@way-to-bot/shared/api/enums/EEventStatus";
import {UploadFileInput} from "../../Components/UploadFileInput";
import {EFileAssigment} from "@way-to-bot/shared/api/enums/EFileAssigment";

interface IFormValues
    extends Omit<TAdminEventCreatePayload, "dateTime" | "fileId" | "duration"> {
    file: UploadFile[];
    dateTime: [Dayjs, Dayjs | null];
}

const STATUS_OPTIONS: SelectProps["options"] = [
    {
        value: EEventStatus.WAITING,
        label: "Ожидает",
    },
    {
        value: EEventStatus.STARTED,
        label: "Начался",
    },
    {
        value: EEventStatus.FINISHED,
        label: "Закончился",
    },
];

const STATUS_MAP: Record<string, BadgeProps["status"]> = {
    [EEventStatus.FINISHED]: "default",
    [EEventStatus.WAITING]: "warning",
    [EEventStatus.STARTED]: "processing",
};


const optionRender: SelectProps["optionRender"] = ({label, value}) => (
    <Badge status={STATUS_MAP[String(value)]} text={label} offset={[4, 0]}/>
);

const labelRender: SelectProps["labelRender"] = ({label, value}) => (
    <Badge status={STATUS_MAP[String(value)]} text={label} offset={[4, 0]}/>
);

const BaseForm = () => {
    return (
        <>
            <Form.Item name={"file"} valuePropName={"fileList"}>
                <UploadFileInput assigment={EFileAssigment.EVENT} accept={"image/*"}/>
            </Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name={"name"} label={"Название"} rules={REQUIRED_RULE}>
                        <Input placeholder={"Название события"}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={"dateTime"} label={"Дата и время"} rules={REQUIRED_RULE}>
                        <DatePicker.RangePicker
                            allowEmpty={[false, true]}
                            showTime
                            style={{width: "100%"}}
                            getPopupContainer={(trigger) => trigger.parentElement!}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name={"price"} label={"Цена участия"} rules={REQUIRED_RULE}>
                        <Input style={{width: "100%"}} placeholder={"Бесплатно"}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={"participantsLimit"} label={"Количество участников"}>
                        <Input style={{width: "100%"}} type={"number"} placeholder={"0"}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name={"status"} label={"Статус"}>
                        <Select optionRender={optionRender} options={STATUS_OPTIONS} labelRender={labelRender}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name={"linkToStream"} label={"Ссылка на трансляцию"}>
                        <Input style={{width: "100%"}} placeholder={"https://youtube.com"}/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name={"locationId"} label={"Локация"} rules={REQUIRED_RULE}>
                        <LocationSelect/>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item name={"hostId"} label={"Организатор"} rules={REQUIRED_RULE}>
                        <UserSelect placeholder={"Выберите пользователя"}/>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item name={"description"} label={"Описание"}>
                        <Input.TextArea rows={4}/>
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};

export {BaseForm}
export type {IFormValues}