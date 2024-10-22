import { AppDispatch } from "../../Store/App/CreateStore.ts";
import { TeamParticipant } from "../../../../src/database/entities/TeamParticipant.ts";
import { eventsSlice } from "../../Store/Events/EventsSlice.ts";
import { Avatar, List } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FC } from "react";
import { ListItemProps } from "antd/es/list";
import { getNotNil } from "../../Utils/GetNotNil.ts";
import { TUser } from "../../Models/TUser.ts";

const UserItem: FC<TUser & { actions?: ListItemProps["actions"] }> = ({
  id,
  Elo,
  name,
  username,
  actions = [],
}) => {
  const fallback = `https://api.dicebear.com/7.x/miniavs/svg?seed=${id}`;

  return (
    <List.Item
      key={id}
      actions={[<span>{Elo}</span>, ...actions]}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
      }}
    >
      <List.Item.Meta
        style={{ display: "flex" }}
        title={name ?? "No Name"}
        description={username}
        avatar={<Avatar src={fallback} />}
      />
    </List.Item>
  );
};

const teamParticipantRenderItem =
  (dispatch: AppDispatch, teamId: number) =>
  ({ participant: { user, id } }: TeamParticipant) => {
    const onClick = () => {
      dispatch(
        eventsSlice.actions.deleteTeamParticipant({
          participantId: id,
          teamId,
        }),
      );
    };

    return (
      <UserItem
        {...getNotNil(user, "teamParticipantRenderItem")}
        actions={[<DeleteOutlined onClick={onClick} />]}
      />
    );
  };

export { teamParticipantRenderItem, UserItem };
