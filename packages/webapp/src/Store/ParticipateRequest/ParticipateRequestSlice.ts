import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IParticipateRequestCreatePayload,
  IParticipateRequestDeletePayload,
  IParticipateRequestUpdatePayload,
} from "@way-to-bot/shared/interfaces/participate-request.interface";

const participateRequestSlice = createSlice({
  name: "participateRequest",
  initialState: {},
  reducers: {
    updateParticipateRequest: (
      _,
      __: PayloadAction<IParticipateRequestUpdatePayload>,
    ) => {},
    createParticipateRequest: (
      _,
      __: PayloadAction<IParticipateRequestCreatePayload>,
    ) => {},
    deleteParticipateRequest: (
      _,
      __: PayloadAction<IParticipateRequestDeletePayload>,
    ) => {},
  },
});

export { participateRequestSlice };
