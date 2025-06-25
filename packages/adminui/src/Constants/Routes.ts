const PREFIX = "/admin";

const ROUTES = {
    any: "*",
    root: "/",
    participateRequestsRoute: `${PREFIX}/participate-requests`,
    users: `${PREFIX}/users`,
    events: `${PREFIX}/events`,
    messages: `${PREFIX}/messages`,
};

export {ROUTES};
