const emptyRoute = "/";
const anyRoute = "/*";

const manageEventsRoute = "manage-events";
const manageEventsIdRoute = `${manageEventsRoute}/:eventId`;
const manageUsersRoute = "manage-users";
const manageUsersIdRoute = `${manageUsersRoute}/:userId`;
const manageLocationsRoute = "manage-locations";
const manageLeaguesRoute = "manage-leagues";
const registrationRoute = "registration";
const manageParticipateRequestsRoute = "participate-requests";

const WEBAPP_ROUTES = {
  emptyRoute,
  anyRoute,
  registrationRoute,
  manageUsersRoute,
  manageUsersIdRoute,
  manageEventsRoute,
  manageEventsIdRoute,
  manageLocationsRoute,
  manageLeaguesRoute,
  manageParticipateRequestsRoute,
};

export { WEBAPP_ROUTES };
