import { Button, Drawer, Form, Input } from "antd";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { EDrawerType } from "../Store/Drawer/DrawerSlice";
import { leaguesApi } from "../Store/Leagues/LeaguesSlice";
import { useCallback } from "react";
import { ILeagueCreatePayload } from "@way-to-bot/shared/interfaces/league.interface";
import { useDrawer } from "../Hooks/UseDrawer";
import { REQUIRED_RULES } from "../Variables";

const BUTTON_STYLE = { float: "right" } as const;

const ManageLeaguesDrawer = () => {
  const { open, onClose } = useDrawer(EDrawerType.MANAGE_LEAGUES_DRAWER);

  const [createLeague, { isLoading }] = leaguesApi.useCreateLeagueMutation();

  const { refetch } = leaguesApi.useGetAllQuery(void 0);

  const [form] = Form.useForm();

  const onFinish = useCallback((payload: ILeagueCreatePayload) => {
    createLeague(payload).then(() => {
      form.resetFields();
      refetch();
    });
  }, []);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement={"right"}
      closable
      getContainer={false}
    >
      <Form layout={"vertical"} onFinish={onFinish} form={form}>
        <Form.Item
          name={"name"}
          label={TEXT.leagues.name}
          rules={REQUIRED_RULES}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            type={"primary"}
            htmlType={"submit"}
            style={BUTTON_STYLE}
            loading={isLoading}
          >
            {TEXT.common.create}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export { ManageLeaguesDrawer };
