import { ColumnsType } from "antd/es/table";
import { Participant } from "../../../../src/database/entities/Participant.ts";
import { Avatar, Typography } from "antd";
import { getUserFullName } from "../../Utils/GetUserFullName.ts";
import { Team } from "../../../../src/database/entities/Team.ts";
import { UserOutlined } from "@ant-design/icons";

const PARTICIPANT_TABLE_COLUMNS: ColumnsType<Participant> = [
  {
    title: "#",
    dataIndex: "user",
    render: ({ photo, id }) => {
      const fallback = `https://api.dicebear.com/7.x/miniavs/svg?seed=${id}`;
      return <Avatar size={44} src={photo ?? fallback} />;
    },
    width: 50,
    align: "center",
  },
  {
    title: "Username",
    dataIndex: "user",
    render: ({ username, name, surname }) => {
      return (
        <Typography>
          <Typography.Title level={5}>
            {getUserFullName(name, surname)}
          </Typography.Title>

          <Typography.Text>{username}</Typography.Text>
        </Typography>
      );
    },
  },
  {
    title: "Elo",
    dataIndex: ["user", "Elo"],
    align: "right",
  },
];

const TEAM_TABLE_COLUMNS: ColumnsType<Team> = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Participants",
    dataIndex: "teamsParticipants",
    align: "right",
    render: (value) => {
      return (
        <span>
          {value.length} <UserOutlined />
        </span>
      );
    },
  },
];

export { PARTICIPANT_TABLE_COLUMNS, TEAM_TABLE_COLUMNS };
