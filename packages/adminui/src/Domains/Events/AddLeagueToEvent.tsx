import {Button, Drawer, Form, Input} from "antd";
import {CopyPlusIcon} from "lucide-react";
import {useBoolean} from "@way-to-bot/shared/utils/UseBoolean";
import {adminApi} from "../../Store/AdminApi";
import {LeaguesSelect} from "../Leagues/LeaguesSelect";
import {FC} from "react";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {TAdminEventLeagueCreatePayload} from "@way-to-bot/shared/api/zod/admin/event-league.schema";
import {REQUIRED_RULE} from "../../Utils/WithRequiredRule";

const AddLeagueToEvent: FC<IWithId> = ({id}) => {
    const [open, {setFalse, setTrue}] = useBoolean()

    const [trigger, {isLoading}] = adminApi.useCreateMutation()

    const onFinish = (payload: Pick<TAdminEventLeagueCreatePayload, "leagueId">) => {
        trigger({
            url: `event-league`, payload: {
                ...payload,
                eventId: id
            }
        }).then(setFalse)
    }


    return <>
        <Drawer open={open} onClose={setFalse} width={720} title={"Добавить лигу"} destroyOnHidden>
            <Form layout={"vertical"} requiredMark={"optional"} onFinish={onFinish}>
                <Form.Item name={"leagueId"} label={"Лига"} rules={REQUIRED_RULE}>
                    <LeaguesSelect/>
                </Form.Item>

                <Form.Item name={"link"} label={"Ссылка на таблицу"}>
                    <Input/>
                </Form.Item>

                <Form.Item style={{float: "right"}}>
                    <Button htmlType={"submit"} type={"primary"} loading={isLoading}>
                        {"Сохранить"}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
        <Button
            onClick={setTrue}
            icon={<CopyPlusIcon size={16}/>}
            type={"text"}
        />
    </>

}

export {AddLeagueToEvent}