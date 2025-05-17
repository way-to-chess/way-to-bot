import {configureStore} from "@reduxjs/toolkit";
import {webAppClientApi} from "./WebAppClientApi";
import {webAppAuthApi} from "./WebAppAuthApi";

const store = configureStore({
    reducer: {
        [webAppClientApi.reducerPath]: webAppClientApi.reducer,
        [webAppAuthApi.reducerPath]: webAppAuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(webAppClientApi.middleware, webAppAuthApi.middleware),
});

export {store};
