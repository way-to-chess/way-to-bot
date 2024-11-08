const emptyRoute = "/";
const anyRoute = "/*";

const manageEventsRoute = "manage-events";
const manageEventsIdRoute = `${manageEventsRoute}/:eventId`;
const manageUsersRoute = "manage-users";
const manageUsersIdRoute = `${manageUsersRoute}/:userId`;
const manageLocationsRoute = "manage-locations";

const WEBAPP_ROUTES = {
  emptyRoute,
  anyRoute,

  manageUsersRoute,
  manageUsersIdRoute,
  manageEventsRoute,
  manageEventsIdRoute,
  manageLocationsRoute,
};

export { WEBAPP_ROUTES };
