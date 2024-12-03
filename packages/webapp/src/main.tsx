import { createRoot } from "react-dom/client";
import { Navigate, Route, Routes } from "react-router-dom";
import "./main.css";
import { isDev, isHttps } from "./Utils/OneLineUtils";
import { Provider } from "react-redux";
import { history, store } from "./Store/App/CreateStore";
import { ReduxRouter } from "@lagunovsky/redux-react-router";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { ManageUsersPage } from "./ManageUsersPage/ManageUsersPage";
import { Layout } from "./Layout/Layout";
import { ManageEventsPage } from "./ManageEventsPage/ManageEventsPage";
import { ManageLocationsPage } from "./ManageLocationsPage/ManageLocationsPage";
import { ManageUsersIdPage } from "./ManageUsersPage/ManageUsersIdPage";
import { ManageEventsIdPage } from "./ManageEventsPage/ManageEventsIdPage";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ManageLeaguesPage } from "./ManageLeaguesPage/ManageLeaguesPage";
import { useEffect, useState } from "react";
import ru from "antd/locale/ru_RU";
import * as Sentry from "@sentry/react";
import { ACL } from "./ACL/ACL";
import { EUserRole } from "@way-to-bot/shared/enums";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

if (isDev && !isHttps) {
  document.body.setAttribute("data-dev", "true");
}

const useTheme = () => {
  const [theme, setTheme] = useState(Telegram.WebApp.colorScheme);

  useEffect(() => {
    const handler = () => {
      setTheme(Telegram.WebApp.colorScheme);
    };

    Telegram.WebApp.onEvent("themeChanged", handler);

    return () => {
      Telegram.WebApp.offEvent("themeChanged", handler);
    };
  }, [setTheme]);

  return theme;
};

const useViewport = () => {
  document.body.style.height = `${Telegram.WebApp.viewportStableHeight}px`;

  Telegram.WebApp.onEvent("viewportChanged", ({ isStateStable }) => {
    if (!isStateStable) {
      return;
    }

    document.body.style.height = `${Telegram.WebApp.viewportStableHeight}px`;
  });
};

// const BackButtonHandler: FC<PropsWithChildren> = ({ children }) => {
//   const location = useLocation();
//
//   useEffect(() => {
//     const indexRoute = matchPath(
//       WEBAPP_ROUTES.manageUsersRoute,
//       location.pathname,
//     );
//
//     Telegram.WebApp.BackButton[indexRoute ? "hide" : "show"]();
//
//     const handler = () => history.back();
//
//     Telegram.WebApp.onEvent("backButtonClicked", handler);
//
//     return () => {
//       Telegram.WebApp.offEvent("backButtonClicked", handler);
//     };
//   }, [location.pathname]);
//
//   return children;
// };

const App = () => {
  const theme = useTheme();

  useViewport();

  return (
    <Provider store={store}>
      <ReduxRouter history={history}>
        <ConfigProvider
          locale={ru}
          theme={{
            algorithm:
              antdTheme[
                theme === "dark" ? "darkAlgorithm" : "defaultAlgorithm"
              ],
          }}
        >
          <ACL roles={[EUserRole.ADMIN]}>
            <button
              onClick={() => {
                throw new Error("This is your first error!");
              }}
            >
              Break the world
            </button>
          </ACL>
          <Routes>
            <Route path={WEBAPP_ROUTES.anyRoute} element={<Layout />}>
              <Route
                index
                element={<Navigate to={WEBAPP_ROUTES.manageUsersRoute} />}
              />

              <Route
                path={WEBAPP_ROUTES.manageUsersRoute}
                element={<ManageUsersPage />}
              />
              <Route
                element={<ManageUsersIdPage />}
                path={WEBAPP_ROUTES.manageUsersIdRoute}
              ></Route>
              <Route
                path={WEBAPP_ROUTES.manageEventsRoute}
                element={<ManageEventsPage />}
              ></Route>
              <Route
                path={WEBAPP_ROUTES.manageEventsIdRoute}
                element={<ManageEventsIdPage />}
              ></Route>
              <Route
                path={WEBAPP_ROUTES.manageLocationsRoute}
                element={<ManageLocationsPage />}
              ></Route>
              <Route
                path={WEBAPP_ROUTES.manageLeaguesRoute}
                element={<ManageLeaguesPage />}
              />
            </Route>
          </Routes>
        </ConfigProvider>
      </ReduxRouter>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
