import { configureStore } from "@reduxjs/toolkit";
import { webAppApi } from "./WebAppApi";

const store = configureStore({
  reducer: {
    [webAppApi.reducerPath]: webAppApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(webAppApi.middleware),
});

export { store };
