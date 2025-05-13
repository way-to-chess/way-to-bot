import {createBrowserRouter, redirect} from "react-router";
import {Layout} from "./Layout/Layout";
import {WEBAPP_ROUTES} from "@way-to-bot/shared/constants/webappRoutes";
import {EventsPage} from "../EventsPage/EventsPage";
import {SingleEventPage} from "../SingleEventPage/SingleEventPage";
import {LeaderboardPage} from "../LeaderboardPage/LeaderboardPage";
import {ProfilePage} from "../ProfilePage/ProfilePage";
import {SingleUserPage} from "../SingleUserPage/SingleUserPage";

const WEB_APP_ROUTER = createBrowserRouter([
    {
        Component: Layout,
        children: [
            {
                path: WEBAPP_ROUTES.emptyRoute,
                element: null,
                loader: () => redirect("/events"),
            },
            {
                path: "/events",
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
                path: "/leaderboard",
                Component: LeaderboardPage,
            },
            {
                path: "/profile",
                Component: ProfilePage,
            },
            {
                path: "/users",
                children: [
                    {
                        path: ":id",
                        Component: SingleUserPage,
                    },
                ],
            }
        ],
    },
]);

export {WEB_APP_ROUTER};
