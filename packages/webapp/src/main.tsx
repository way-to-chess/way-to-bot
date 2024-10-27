import { createRoot } from "react-dom/client";
import { Route, Routes } from "react-router-dom";
import "./main.css";
import { isDev } from "./Utils/OneLineUtils";
import { Provider } from "react-redux";
import { history, store } from "./Store/App/CreateStore";
import { ReduxRouter } from "@lagunovsky/redux-react-router";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";
import { ManageUsersPage } from "./ManageUsersPage/ManageUsersPage";
import { Layout } from "./Layout/Layout";

document.body.setAttribute("data-dev", String(isDev));

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ReduxRouter history={history}>
      <Routes>
        <Route path={WEBAPP_ROUTES.emptyRoute} element={<Layout />}>
          <Route
            path={WEBAPP_ROUTES.manageUsersRoute}
            element={<ManageUsersPage />}
          ></Route>
        </Route>
      </Routes>
    </ReduxRouter>
  </Provider>,
);
