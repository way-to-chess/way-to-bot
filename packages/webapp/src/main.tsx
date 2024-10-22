import { createRoot } from "react-dom/client";
import { Route, Routes } from "react-router-dom";
import { EventsPage } from "./EventsPage/EventsPage";
import { SingleEventPage } from "./SingleEventPage/SingleEventPage";
import { Layout } from "./Layout/Layout";
import "./main.css";
import { StatisticsPage } from "./StatisticsPage/StatisticsPage";
import { ProfilePage } from "./ProfilePage/ProfilePage";
import { isDev } from "./Utils/OneLineUtils";
import { Provider } from "react-redux";
import { WelcomePage } from "./WelcomePage/WelcomePage";
import { history, store } from "./Store/App/CreateStore";
import { ReduxRouter } from "@lagunovsky/redux-react-router";
import { LocationsPage } from "./AdminUI/Locations/LocationsPage/LocationsPage";
import { UpdateLocationPage } from "./AdminUI/Locations/UpdateLocationPage/UpdateLocationPage";
import { CreateLocationPage } from "./AdminUI/Locations/CreateLocationPage/CreateLocationPage";
import { UpdateProfilePage } from "./UpdateProfilePage/UpdateProfilePage";
import { ManageEventsPage } from "./AdminUI/Events/ManageEventsPage";
import { CreateEventForm } from "./AdminUI/Events/CreateEventForm";
import { UpdateEventForm } from "./AdminUI/Events/UpdateEventForm";
import { ManageSingleEventPage } from "./AdminUI/Events/ManageSingleEventPage";
import { UpdateSingleEventTeamPage } from "./AdminUI/Events/UpdateSingleEventTeamPage";
import { CreateSingleEventTeamPage } from "./AdminUI/Events/CreateSingleEventTeamPage";
import { CreateSingleEventGamePage } from "./AdminUI/Events/SingleEventGame/CreateSingleEventGamePage";
import { UpdateSingleEventGamePage } from "./AdminUI/Events/SingleEventGame/UpdateSingleEventGamePage";
import { WEBAPP_ROUTES } from "@way-to-bot/shared/constants/webappRoutes";

document.body.setAttribute("data-dev", String(isDev));

createRoot(document.getElementById("root")!).render(
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

        <Route
          path={WEBAPP_ROUTES.locationsRoute}
          element={<LocationsPage />}
        />

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
