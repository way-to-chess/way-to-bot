import { FC } from "react";
import classes from "./Empty.module.css";
import { withProps } from "../Utils/WithProps.ts";

interface IEmptyProps {
  title: string;
  subtitle: string;
}

const Empty: FC<IEmptyProps> = ({ title, subtitle }) => {
  return (
    <div className={classes.empty}>
      <h2 className={classes.title}>{title}</h2>
      <p className={classes.subtitle}>{subtitle}</p>
    </div>
  );
};

const EmptyLeaderboard = withProps(Empty)({
  title: "Leaderboard is empty",
  subtitle: "Participate events and be the first",
});

const EmptyEventsPage = withProps(Empty)({
  title: "No events",
  subtitle: "If you admin - create one",
});

export { EmptyLeaderboard, EmptyEventsPage };
