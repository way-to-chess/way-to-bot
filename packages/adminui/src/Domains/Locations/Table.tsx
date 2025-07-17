import {Avatar, Button, Drawer, Flex, Form, Table, TableProps} from "antd";
import {ImageIcon, PlusIcon} from "lucide-react";
import {locationApi} from "../../Store/Location/LocationApi";
import {ESortDirection} from "@way-to-bot/shared/api/enums/ESortDirection";
import {extractId} from "../../Utils/Extract";
import {useBoolean} from "../../Utils/UseBoolean";
import {AdminDTOLocationGetMany} from "@way-to-bot/shared/api/DTO/admin/location.DTO";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";
import {FC} from "react";


// id: number;
// title: string;
// url?: string | null;
// address?: string | null;
// benefits: ELocationBenefits[];
// fileId?: number | null;
// preview?: IFileEntity | null;
// createdAt: Date;
// updatedAt: Date;

const CreateForm: FC<{ onClose: VoidFunction }> = () => {
    const onFinish = () => {

    }

    const initialValues = {}

    return <Form
        layout={"vertical"}
        requiredMark={"optional"}
        onFinish={onFinish}
        initialValues={initialValues}
    >
        {"В разработке"}

    </Form>
}

const COLUMNS: TableProps<AdminDTOLocationGetMany>["columns"] = [
    {
        title: "ID",
        dataIndex: "id",
        width: 50,
    },
    {
        title: <ImageIcon size={18}/>,
        className: "iconCenter",
        align: "center",
        width: 30,
        render: (_, {preview}) => <Avatar shape={"square"} src={getPreviewSrc(preview?.previewUrl)}/>
    },
    {
        title: "Название",
        dataIndex: "title",
    },
    {
        title: "Адрес",
        dataIndex: "address",
    },
]

const LocationsTable = () => {
    const {data, isFetching} = locationApi.useGetAllLocationsQuery({
        sort: {
            field: "createdAt",
            direction: ESortDirection.ASC
        }
    })

    const [open, {setFalse, setTrue}] = useBoolean()

    return <>
        <Drawer
            title={"Создать новую локацию"}
            open={open}
            onClose={setFalse}
            width={720}
        >
            <CreateForm onClose={setFalse}/>
        </Drawer>
        <Flex vertical gap={8}>

            <Button onClick={setTrue} style={{width: "fit-content", alignSelf: "end"}} icon={<PlusIcon size={14}/>}
                    type={"primary"}>
                {"Создать"}
            </Button>
            <Table
                style={{width: "100%"}}
                rowKey={extractId}
                dataSource={data?.data}
                loading={isFetching}
                columns={COLUMNS}
            />
        </Flex>
    </>
}

export {LocationsTable}