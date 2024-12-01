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

//UNCOMMENT IF NEEDED
// const Test = () => {
//   const [viewportHeight, setViewportHeight] = useState(
//     Telegram.WebApp.viewportHeight,
//   );
//   const [viewportStableHeight, setViewportStableHeight] = useState(
//     Telegram.WebApp.viewportStableHeight,
//   );
//
//   document.body.style.height = `${Telegram.WebApp.viewportStableHeight}px`;
//
//   Telegram.WebApp.onEvent("viewportChanged", ({ isStateStable }) => {
//     if (!isStateStable) {
//       return;
//     }
//
//     document.body.style.height = `${Telegram.WebApp.viewportStableHeight}px`;
//
//     setViewportHeight(Telegram.WebApp.viewportHeight);
//     setViewportStableHeight(Telegram.WebApp.viewportStableHeight);
//   });
//
//   return (
//     <div style={{ textAlign: "center" }}>
//       {`viewportHeight: ${viewportHeight}`}
//       {"    "}
//       {`viewportStableHeight: ${viewportStableHeight}`}
//     </div>
//   );
// };

const App = () => {
  const theme = useTheme();

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
