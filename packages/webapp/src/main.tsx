import { createRoot } from "react-dom/client";
import { Navigate, Route, Routes } from "react-router-dom";
import "./main.css";
import { isDev } from "./Utils/OneLineUtils";
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
import { ConfigProvider, theme } from "antd";

if (isDev) {
  document.body.setAttribute("data-dev", "true");
}

const App = () => {
  const { darkAlgorithm, defaultAlgorithm } = theme;

  return (
    <Provider store={store}>
      <ReduxRouter history={history}>
        <ConfigProvider
          theme={{
            algorithm:
              Telegram.WebApp.colorScheme === "dark"
                ? darkAlgorithm
                : defaultAlgorithm,
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
            </Route>
          </Routes>
        </ConfigProvider>
      </ReduxRouter>
    </Provider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
