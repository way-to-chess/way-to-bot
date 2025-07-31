import {FC} from "react";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {useDomainContext} from "./Domain";
import {adminApi} from "../Store/AdminApi";
import {Button, Popconfirm} from "antd";
import {TrashIcon} from "lucide-react";

const DeleteButton: FC<IWithId> = ({id}) => {
    const {url} = useDomainContext();
    const [trigger, {isLoading}] = adminApi.useDeleteMutation();

    const onConfirm = () => trigger({id, url});

    return (
        <Popconfirm
            title={"Удалить?"}
            okText={"Да"}
            cancelText={"Нет"}
            onConfirm={onConfirm}
        >
            <Button
                icon={<TrashIcon size={16}/>}
                danger
                loading={isLoading}
                type={"text"}
            />
        </Popconfirm>
    );
};

export {DeleteButton}