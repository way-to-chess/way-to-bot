import {configureStore} from "@reduxjs/toolkit";
import {webAppClientApi} from "./WebAppClientApi";
import {webAppAuthApi} from "./WebAppAuthApi";
import {authSlice} from "./Auth/AuthSlice";

const store = configureStore({
    reducer: {
        [authSlice.reducerPath]: authSlice.reducer,
        [webAppClientApi.reducerPath]: webAppClientApi.reducer,
        [webAppAuthApi.reducerPath]: webAppAuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(webAppClientApi.middleware, webAppAuthApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>

export {store};
