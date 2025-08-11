import {createBrowserRouter, redirect} from "react-router";
import {Layout} from "./Layout/Layout";
import {WEBAPP_ROUTES} from "@way-to-bot/shared/constants/webappRoutes";
import {EventsPage} from "../EventsPage/EventsPage";
import {SingleEventPage} from "../SingleEventPage/SingleEventPage";
import {LeaderboardPage} from "../LeaderboardPage/LeaderboardPage";
import {SingleUserPage} from "../SingleUserPage/SingleUserPage";
import {Error} from "../Error/Error"
import {TutorialPage} from "../Tutorial/TutorialPage";
import {RootPage} from "../RootPage/RootPage";

const WEB_APP_ROUTER = createBrowserRouter([
    {
        Component: Layout,
        errorElement: <Error title={"Ошибка в приложении"} text={"Обратитесь к разработчикам"}/>,
        children: [
            {
                path: WEBAPP_ROUTES.emptyRoute,
                Component: RootPage,
            },
            {
                path: "/:type/events",
                children: [
                    {
                        index: true,
                        Component: EventsPage,
                    },
                    {
                        path: ":id",
                        Component: SingleEventPage,
                    },
                ],
            },
            {
                path: "/:type/leaderboard",
                Component: LeaderboardPage,
            },
            {
                path: "/:type/users",
                children: [
                    {
                        path: ":id",
                        Component: SingleUserPage,
                    },
                ],
            },
            {
                path: "/:type/tutorial",
                Component: TutorialPage,
            },
            {
                path: "*",
                loader: () => redirect(WEBAPP_ROUTES.emptyRoute)
            },
        ],
    },
]);

export {WEB_APP_ROUTER};
