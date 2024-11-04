import {memo} from "react";
import classes from "./ManageLeaguesPage.module.css";

const ManageLeaguesPage = memo(() => {
    const value = "ManageLeaguesPage";

    return <div className={classes.manageLeaguesPage}>{value}</div>;
});
ManageLeaguesPage.displayName = "ManageLeaguesPage";

export {ManageLeaguesPage};
