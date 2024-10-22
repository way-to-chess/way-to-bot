import ReactDOM from "react-dom/client";
import { Route, Routes } from "react-router-dom";
import { EventsPage } from "./EventsPage/EventsPage.tsx";
import { SingleEventPage } from "./SingleEventPage/SingleEventPage.tsx";
import { Layout } from "./Layout/Layout.tsx";
import "./main.css";
import { StatisticsPage } from "./StatisticsPage/StatisticsPage.tsx";
import { ProfilePage } from "./ProfilePage/ProfilePage.tsx";
import { isDev } from "./Utils/OneLineUtils.ts";
import { Provider } from "react-redux";
import { WelcomePage } from "./WelcomePage/WelcomePage.tsx";
import { history, store } from "./Store/App/CreateStore.ts";
import { ReduxRouter } from "@lagunovsky/redux-react-router";
import { LocationsPage } from "./AdminUI/Locations/LocationsPage/LocationsPage.tsx";
import { UpdateLocationPage } from "./AdminUI/Locations/UpdateLocationPage/UpdateLocationPage.tsx";
import { CreateLocationPage } from "./AdminUI/Locations/CreateLocationPage/CreateLocationPage.tsx";
import { UpdateProfilePage } from "./UpdateProfilePage/UpdateProfilePage.tsx";
import { ManageEventsPage } from "./AdminUI/Events/ManageEventsPage.tsx";
import { CreateEventForm } from "./AdminUI/Events/CreateEventForm.tsx";
import { UpdateEventForm } from "./AdminUI/Events/UpdateEventForm.tsx";
import { ManageSingleEventPage } from "./AdminUI/Events/ManageSingleEventPage.tsx";
import { UpdateSingleEventTeamPage } from "./AdminUI/Events/UpdateSingleEventTeamPage.tsx";
import { CreateSingleEventTeamPage } from "./AdminUI/Events/CreateSingleEventTeamPage.tsx";
import { CreateSingleEventGamePage } from "./AdminUI/Events/SingleEventGame/CreateSingleEventGamePage.tsx";
import { UpdateSingleEventGamePage } from "./AdminUI/Events/SingleEventGame/UpdateSingleEventGamePage.tsx";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes.ts"

document.body.setAttribute("data-dev", String(isDev));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ReduxRouter history={history}>
      <Routes>
        <Route path={WEBAPP_ROUTES.emptyRoute} element={<Layout />}>
          <Route path={WEBAPP_ROUTES.eventsRoute} element={<EventsPage />} />
          <Route
            path={WEBAPP_ROUTES.singleEventRoute}
            element={<SingleEventPage />}
          />
          <Route
            path={WEBAPP_ROUTES.statisticsRoute}
            element={<StatisticsPage />}
          />
          <Route path={WEBAPP_ROUTES.profileRoute} element={<ProfilePage />} />
        </Route>
        <Route
          path={WEBAPP_ROUTES.manageEventsRoute}
          element={<ManageEventsPage />}
        />

        <Route
          path={WEBAPP_ROUTES.createEventRoute}
          element={<CreateEventForm />}
        />

        <Route
          path={WEBAPP_ROUTES.updateEventRoute}
          element={<UpdateEventForm />}
        />

        <Route
          path={WEBAPP_ROUTES.manageSingleEventRoute}
          element={<ManageSingleEventPage />}
        />

        <Route
          path={WEBAPP_ROUTES.updateSingleEventTeamRoute}
          element={<UpdateSingleEventTeamPage />}
        />

        <Route
          path={WEBAPP_ROUTES.createSingleEventTeamRoute}
          element={<CreateSingleEventTeamPage />}
        />

        <Route
          path={WEBAPP_ROUTES.updateSingleEventGameRoute}
          element={<UpdateSingleEventGamePage />}
        />

        <Route
          path={WEBAPP_ROUTES.createSingleEventGameRoute}
          element={<CreateSingleEventGamePage />}
        />

        <Route path={WEBAPP_ROUTES.locationsRoute} element={<LocationsPage />} />

        <Route
          path={WEBAPP_ROUTES.updateLocationRoute}
          element={<UpdateLocationPage />}
        />

        <Route
          path={WEBAPP_ROUTES.createLocationRoute}
          element={<CreateLocationPage />}
        />

        <Route
          path={WEBAPP_ROUTES.updateProfileRoute}
          element={<UpdateProfilePage />}
        />

        <Route path={WEBAPP_ROUTES.welcomeRoute} element={<WelcomePage />} />
      </Routes>
    </ReduxRouter>
  </Provider>,
);
