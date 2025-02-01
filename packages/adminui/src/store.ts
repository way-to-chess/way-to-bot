import { configureStore } from "@reduxjs/toolkit";
import { participateRequestsApi } from "./Domains/ParticipateRequests/Slice";

const STORE = configureStore({
  reducer: {
    [participateRequestsApi.reducerPath]: participateRequestsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(participateRequestsApi.middleware),
});

export { STORE };
