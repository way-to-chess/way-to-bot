import { createBrowserRouter, redirect } from "react-router";
import { Layout } from "./Layout/Layout";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";

const Events = () => {
  return "events";
};

const Leaderboard = () => {
  return "leaderboard";
};

const Profile = () => {
  return "profile";
};

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
            Component: Events,
          },
        ],
      },
      {
        path: "/leaderboard",
        Component: Leaderboard,
      },
      {
        path: "/profile",
        Component: Profile,
      },
    ],
  },
]);

export { WEB_APP_ROUTER };
