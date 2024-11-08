import { memo } from "react";
import { useSelector } from "react-redux";
import { leaguesSlice } from "../Store/Leagues/LeaguesSlice";
import { List } from "antd";
import { ManageLeaguesDrawer } from "./ManageLeaguesDrawer";

const ManageLeaguesPage = memo(() => {
  const leagues = useSelector(leaguesSlice.selectors.leagues);

  return (
    <>
      <ManageLeaguesDrawer />
      <List
        dataSource={leagues}
        renderItem={({ name }) => {
          return (
            <List.Item>
              <List.Item.Meta title={name} />
            </List.Item>
          );
        }}
      />
    </>
  );
});
ManageLeaguesPage.displayName = "ManageLeaguesPage";

export { ManageLeaguesPage };
