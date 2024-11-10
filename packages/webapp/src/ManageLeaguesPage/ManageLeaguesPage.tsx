import { FC, memo } from "react";
import { useSelector } from "react-redux";
import { leaguesSlice } from "../Store/Leagues/LeaguesSlice";
import { Button, Flex, List } from "antd";
import { ManageLeaguesDrawer } from "./ManageLeaguesDrawer";
import { useActionCreator } from "../Hooks/UseActionCreator";
import { TEXT } from "@way-to-bot/shared/constants/text";
import { drawerSlice, EDrawerType } from "../Store/Drawer/DrawerSlice";
import { ILeagueDeletePayload } from "@way-to-bot/shared/interfaces/league.interface";
import { useParamSelector } from "../Hooks/UseParamSelector";
import { LEAGUES_LOAD_REQUEST_SYMBOL } from "../Store/Leagues/LeaguesVariables";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { ERequestStatus } from "../Store/RequestManager/RequestManagerModels";

const EditButton = () => {
  const open = useActionCreator(drawerSlice.actions.openDrawer, {
    drawerType: EDrawerType.MANAGE_LEAGUES_DRAWER,
  });

  return <Button onClick={open}>{TEXT.common.edit}</Button>;
};

const DeleteButton: FC<ILeagueDeletePayload> = ({ leagueId }) => {
  const deleteLeague = useActionCreator(leaguesSlice.actions.deleteLeague, {
    leagueId,
  });

  return (
    <Button onClick={deleteLeague} danger>
      {TEXT.common.delete}
    </Button>
  );
};

const ManageLeaguesPage = memo(() => {
  const leagues = useSelector(leaguesSlice.selectors.leagues);

  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    LEAGUES_LOAD_REQUEST_SYMBOL,
  );

  return (
    <>
      <ManageLeaguesDrawer />
      <List
        loading={status === ERequestStatus.loading}
        style={{ padding: 16 }}
        dataSource={leagues}
        renderItem={({ name, id }) => {
          return (
            <List.Item>
              <List.Item.Meta title={name} />

              <Flex gap={8} justify={"flex-end"}>
                <EditButton />
                <DeleteButton leagueId={id} />
              </Flex>
            </List.Item>
          );
        }}
      />
    </>
  );
});
ManageLeaguesPage.displayName = "ManageLeaguesPage";

export { ManageLeaguesPage };
