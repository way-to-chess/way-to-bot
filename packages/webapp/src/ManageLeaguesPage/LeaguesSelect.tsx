import { memo } from "react";
import { Select, SelectProps } from "antd";
import { useSelector } from "react-redux";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice";
import { LEAGUES_LOAD_REQUEST_SYMBOL } from "../Store/Leagues/LeaguesVariables";
import { leaguesSlice } from "../Store/Leagues/LeaguesSlice";
import { useParamSelector } from "../Hooks/UseParamSelector";

const LeaguesSelect = memo<Omit<SelectProps, "options" | "loading">>(
  (props) => {
    const loading = useParamSelector(
      requestManagerSlice.selectors.loadingBySymbol,
      LEAGUES_LOAD_REQUEST_SYMBOL,
    );

    const leagues = useSelector(leaguesSlice.selectors.leagues);

    return (
      <Select
        loading={loading}
        options={leagues.map(({ id, name }) => ({
          value: id,
          label: name,
        }))}
        {...props}
      />
    );
  },
);

export { LeaguesSelect };
