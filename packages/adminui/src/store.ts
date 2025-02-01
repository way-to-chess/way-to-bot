import { configureStore } from "@reduxjs/toolkit";
import { API } from "./Api";
import { participateRequestsSlice } from "./Domains/ParticipateRequests/Slice";

const STORE = configureStore({
  reducer: {
    [API.reducerPath]: API.reducer,
    [participateRequestsSlice.name]: participateRequestsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(API.middleware),
});

export { STORE };
