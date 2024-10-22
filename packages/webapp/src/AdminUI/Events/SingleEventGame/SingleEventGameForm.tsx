import { Flex, Form, Input, Table } from "antd";
import { BackButton } from "../../../Components/BackButton.tsx";
import { generatePath, useParams } from "react-router-dom";
import { FixedButton } from "../../../Components/FixedButton.tsx";
import { useSelector } from "react-redux";
import { eventsSlice } from "../../../Store/Events/EventsSlice.ts";
import { TableRowSelection } from "antd/es/table/interface";
import { TEAM_TABLE_COLUMNS } from "../TableColumns.tsx";
import { RequestStatusToComponent } from "../../../Components/RequestStatusToComponent.tsx";
import { EVENTS_GET_BY_ID_REQUEST_SYMBOL } from "../../../Store/Events/EventsVariables.ts";
import { withProps } from "../../../Utils/WithProps.ts";
import { FC } from "react";
import { getNotNil } from "../../../Utils/GetNotNil.ts";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes.ts";

interface IAddTeamsProps {
  onChange?: (ids: number[]) => void;
  value?: number[];
  id?: string;
}

//todo get type from server
type Team  = any

const AddTeams: FC<IAddTeamsProps> = ({ onChange, value }) => {
  const eventTeams = useSelector(eventsSlice.selectors.singleEventTeams);

  const rowSelection: TableRowSelection<Team> = {
    type: "checkbox",
    onChange: (selectedRowKeys) => {
      onChange?.(selectedRowKeys as number[]);
    },
    selectedRowKeys: value,
  };

  return (
    <Table
      columns={TEAM_TABLE_COLUMNS}
      showHeader={false}
      rowSelection={rowSelection}
      rowKey={"id"}
      dataSource={eventTeams}
    />
  );
};

interface ISingleEventGameFormInitialValues {
  name: string;
  teamIds: number[];
}

interface ISingleEventGameFormFinishValues
  extends ISingleEventGameFormInitialValues {
  eventId: number;
}

interface ISingleEventGameFormProps {
  initialValues: ISingleEventGameFormInitialValues;
  onFinish: (values: ISingleEventGameFormFinishValues) => void;
}

const SingleEventGameFormSuccess: FC<ISingleEventGameFormProps> = ({
  onFinish,
  initialValues,
}) => {
  const [form] = Form.useForm();

  const { eventId } = useParams();

  const onFormFinish = (values: ISingleEventGameFormInitialValues) => {
    onFinish({
      ...values,
      eventId: Number(
        getNotNil(eventId, "SingleEventGameFormSuccess -> onFormFinish"),
      ),
    });
  };

  return (
    <Flex style={{ padding: 16 }} gap={16} vertical>
      <BackButton
        path={generatePath(WEBAPP_ROUTES.manageSingleEventRoute, { eventId })}
      />
      <Form form={form} onFinish={onFormFinish} initialValues={initialValues}>
        <Form.Item name={"name"} label={"Name"} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={"teamIds"} label={"Teams"}>
          <AddTeams />
        </Form.Item>
        <Form.Item>
          <FixedButton htmlType={"submit"}>{"Submit"}</FixedButton>
        </Form.Item>
      </Form>
    </Flex>
  );
};

const SingleEventGameForm: FC<ISingleEventGameFormProps> = (props) => {
  return (
    <RequestStatusToComponent
      requestSymbol={EVENTS_GET_BY_ID_REQUEST_SYMBOL}
      SUCCESS={withProps(SingleEventGameFormSuccess)(props)}
    />
  );
};

export {
  SingleEventGameForm,
  type ISingleEventGameFormFinishValues,
  type ISingleEventGameFormInitialValues,
};
