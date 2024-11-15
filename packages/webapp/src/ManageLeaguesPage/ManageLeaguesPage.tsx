import { FC, useCallback } from "react";
import { leaguesApi } from "../Store/Leagues/LeaguesSlice";
import { Button, Flex, List } from "antd";
import { ManageLeaguesDrawer } from "./ManageLeaguesDrawer";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { ILeagueDeletePayload } from "@way-to-bot/shared/interfaces/league.interface";
import { DEFAULT_PADDING } from "../Variables";
import { LeagueEntity } from "@way-to-bot/shared/entities/league.entity";

const EditButton = () => {
  const open = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_LEAGUES_DRAWER,
  });

  return <Button onClick={open}>{TEXT.common.edit}</Button>;
};

const DeleteButton: FC<ILeagueDeletePayload> = ({ leagueId }) => {
  const [deleteLeague, { isLoading }] = leaguesApi.useDeleteLeagueMutation();

  const { refetch } = leaguesApi.useGetAllQuery(void 0);

  const onClick = useCallback(
    () =>
      deleteLeague({ leagueId }).then(() => {
        refetch();
      }),
    [leagueId],
  );

  return (
    <Button onClick={onClick} danger loading={isLoading}>
      {TEXT.common.delete}
    </Button>
  );
};

const renderLeague = ({ name, id }: LeagueEntity) => {
  return (
    <List.Item>
      <List.Item.Meta title={name} />

      <Flex gap={8} justify={"flex-end"}>
        <EditButton />
        <DeleteButton leagueId={id} />
      </Flex>
    </List.Item>
  );
};

const ManageLeaguesList = () => {
  const { data, isFetching } = leaguesApi.useGetAllQuery();

  return (
    <List
      loading={isFetching}
      style={DEFAULT_PADDING}
      dataSource={data}
      renderItem={renderLeague}
    />
  );
};

const ManageLeaguesPage = () => (
  <>
    <ManageLeaguesDrawer />
    <ManageLeaguesList />
  </>
);
ManageLeaguesPage.displayName = "ManageLeaguesPage";

export { ManageLeaguesPage };
