import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IParticipateRequest,
  IParticipateRequestCreatePayload,
  IParticipateRequestDeletePayload,
  IParticipateRequestUpdatePayload,
} from "@way-to-bot/shared/interfaces/participate-request.interface";
import { IResponseWithData } from "@way-to-bot/shared/interfaces/response.interface";

interface IParticipateRequestInitialState {
  allRequests: IParticipateRequest[];
}

const initialState: IParticipateRequestInitialState = {
  allRequests: [],
};

const participateRequestSlice = createSlice({
  name: "participateRequest",
  initialState,
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
    allRequestsReceived: (
      sliceState,
      { payload }: PayloadAction<IResponseWithData<IParticipateRequest[]>>,
    ) => {
      sliceState.allRequests = payload.data;
    },
  },
  selectors: {
    allRequests: (sliceState) => sliceState.allRequests,
  },
});

export { participateRequestSlice };
