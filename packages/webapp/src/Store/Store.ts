import {configureStore} from "@reduxjs/toolkit";
import {clientApi} from "./ClientApi";
import {authApi} from "@way-to-bot/shared/redux/authApi";
import {authSlice} from "@way-to-bot/shared/redux/authSlice";

const store = configureStore({
    reducer: {
        [authSlice.reducerPath]: authSlice.reducer,
        [clientApi.reducerPath]: clientApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(clientApi.middleware, authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>

export {store};
