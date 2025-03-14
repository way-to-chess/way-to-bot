import { createRoot } from "react-dom/client";
import { Navigate, Route, Routes } from "react-router-dom";
import "./main.css";
import { isDev, isHttps } from "./Utils/OneLineUtils";
import { Provider, useDispatch, useSelector } from "react-redux";
import { history as browserHistory, store } from "./Store/App/CreateStore";
import { ReduxRouter, replace } from "@lagunovsky/redux-react-router";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { ManageUsersPage } from "./ManageUsersPage/ManageUsersPage";
import { Layout } from "./Layout/Layout";
import { ManageEventsPage } from "./ManageEventsPage/ManageEventsPage";
import { ManageLocationsPage } from "./ManageLocationsPage/ManageLocationsPage";
import { ManageUsersIdPage } from "./ManageUsersPage/ManageUsersIdPage";
import { ManageEventsIdPage } from "./ManageEventsPage/ManageEventsIdPage";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ManageLeaguesPage } from "./ManageLeaguesPage/ManageLeaguesPage";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import ru from "antd/locale/ru_RU";
import * as Sentry from "@sentry/react";
import { RegistrationPage } from "./Registration/RegistrationPage";
import { ManageParticipateRequestsPage } from "./ManageParticipateRequestsPage/ManageParticipateRequestsPage";
import { selectHistoryStack } from "./Store/Router/HistoryReducer";
import { getNotNil } from "@way-to-bot/shared/utils/getNotNil";

if (!isDev) {
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
}

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
      document.body.style.height = `${Telegram.WebApp.viewportHeight}px`;

      return;
    }

    document.body.style.height = `${Telegram.WebApp.viewportStableHeight}px`;
  });
};

const BackButtonHandler: FC<PropsWithChildren> = ({ children }) => {
  const historyStack = useSelector(selectHistoryStack);

  const dispatch = useDispatch();

  useEffect(() => {
    if (historyStack?.length >= 2) {
      Telegram.WebApp.BackButton.show();

      const handler = () => {
        const historyItem = getNotNil(
          historyStack[historyStack.length - 2],
          `historyItem | stack: ${JSON.stringify(historyStack)}`,
        );

        dispatch(
          replace(historyItem.location.pathname, {
            fromBackButton: true,
          }),
        );
      };

      Telegram.WebApp.BackButton.onClick(handler);

      return () => {
        Telegram.WebApp.BackButton.offClick(handler);
      };
    }

    Telegram.WebApp.BackButton.hide();

    return () => {};
  }, [historyStack, dispatch]);

  return children;
};

const App = () => {
  const theme = useTheme();

  useViewport();

  return (
    <Provider store={store}>
      <ReduxRouter history={browserHistory}>
        <ConfigProvider
          locale={ru}
          theme={{
            cssVar: true,
            algorithm:
              antdTheme[
                theme === "dark" ? "darkAlgorithm" : "defaultAlgorithm"
              ],
          }}
        >
          <BackButtonHandler>
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
                <Route
                  path={WEBAPP_ROUTES.registrationRoute}
                  element={<RegistrationPage />}
                />
                <Route
                  path={WEBAPP_ROUTES.manageParticipateRequestsRoute}
                  element={<ManageParticipateRequestsPage />}
                />
              </Route>
            </Routes>
          </BackButtonHandler>
        </ConfigProvider>
      </ReduxRouter>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
