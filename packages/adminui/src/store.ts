import { configureStore } from "@reduxjs/toolkit";
import { api } from "@way-to-bot/shared/Api";
import { participateRequestsSlice } from "./Domains/ParticipateRequests/Slice";
import { entitySlice } from "./EntitySlice";

const STORE = configureStore({
  reducer: {
    [entitySlice.name]: entitySlice.reducer,
    [api.reducerPath]: api.reducer,
    [participateRequestsSlice.name]: participateRequestsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export { STORE };
