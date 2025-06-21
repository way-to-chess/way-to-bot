import {configureStore} from "@reduxjs/toolkit";
import {entitySlice} from "../EntitySlice";
import {adminApi} from "./AdminApi";
import {authApi} from "@way-to-bot/shared/redux/authApi";
import {authSlice} from "@way-to-bot/shared/redux/authSlice";

const store = configureStore({
    reducer: {
        [entitySlice.name]: entitySlice.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [authSlice.reducerPath]: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(adminApi.middleware, authApi.middleware),
});

export {store};
