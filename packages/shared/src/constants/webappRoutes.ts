const emptyRoute = "/";
const anyRoute = "/*";
const eventsRoute = "/events";
const singleEventRoute = `${eventsRoute}/:eventId`;
const adminRoute = "/admin";
const statisticsRoute = "/statistics";
const profileRoute = "/profile/:id";
const updateProfileRoute = `${profileRoute}/update`;
const welcomeRoute = "/welcome";
const locationsRoute = "/location";
const manageEventsRoute = "manage-events";
const manageEventsIdRoute = `${manageEventsRoute}/:eventId`;
const createEventRoute = `${manageEventsRoute}/create`;
const updateEventRoute = `${manageEventsRoute}/update/:eventId`;
const updateLocationRoute = `${adminRoute}${locationsRoute}/update/:locationId`;
const createLocationRoute = `${adminRoute}${locationsRoute}/create`;
const manageSingleEventRoute = `${adminRoute}${singleEventRoute}`;
const createSingleEventTeamRoute = `${manageSingleEventRoute}/team/create`;
const updateSingleEventTeamRoute = `${manageSingleEventRoute}/team/update/:teamId`;
const createSingleEventGameRoute = `${manageSingleEventRoute}/game/create`;
const updateSingleEventGameRoute = `${manageSingleEventRoute}/game/update/:gameId`;

const manageUsersRoute = "manage-users";
const manageUsersIdRoute = `${manageUsersRoute}/:userId`;
const manageLocationsRoute = "manage-locations";

const WEBAPP_ROUTES = {
  emptyRoute,
  eventsRoute,
  singleEventRoute,
  statisticsRoute,
  profileRoute,
  welcomeRoute,
  anyRoute,
  locationsRoute,
  updateLocationRoute,
  createLocationRoute,
  updateProfileRoute,
  createEventRoute,
  updateEventRoute,
  manageSingleEventRoute,
  updateSingleEventTeamRoute,
  createSingleEventTeamRoute,
  createSingleEventGameRoute,
  updateSingleEventGameRoute,

  manageUsersRoute,
  manageUsersIdRoute,
  manageEventsRoute,
  manageEventsIdRoute,
  manageLocationsRoute,
};

export { WEBAPP_ROUTES };
