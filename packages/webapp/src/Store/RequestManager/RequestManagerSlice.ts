import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWithError } from "@way-to-bot/shared/interfaces/error.interface";
import { ERequestStatus } from "./RequestManagerModels";

interface IRequestManagerSlice {
  [key: string]: {
    status: ERequestStatus;
    error?: string;
  };
}

const initialState: IRequestManagerSlice = {};

interface IWithSymbol {
  symbol: string;
}

const requestManagerSlice = createSlice({
  name: "requestManager",
  initialState,
  reducers: {
    loading: (state, { payload: { symbol } }: PayloadAction<IWithSymbol>) => {
      state[symbol] = {
        status: ERequestStatus.loading,
      };
    },
    success: (state, { payload: { symbol } }: PayloadAction<IWithSymbol>) => {
      state[symbol] = {
        status: ERequestStatus.success,
      };
    },
    error: (
      state,
      { payload: { symbol, error } }: PayloadAction<IWithSymbol & IWithError>,
    ) => {
      state[symbol] = {
        status: ERequestStatus.error,
        error,
      };
    },
    clear: (
      state,
      {
        payload: { symbol },
      }: PayloadAction<IWithSymbol | { symbol: string[] }>,
    ) => {
      const symbols = Array.isArray(symbol) ? symbol : [symbol];

      symbols.forEach((s) => {
        delete state[s];
      });
    },
  },
  selectors: {
    statusBySymbol: (sliceState, symbol: string) =>
      sliceState[symbol]?.status ?? ERequestStatus.idle,
    errorBySymbol: (sliceState, symbol: string) =>
      sliceState[symbol]?.error ?? "Unknown Error",
    loadingBySymbol: (sliceState, symbol: string) =>
      sliceState[symbol]?.status === ERequestStatus.loading,
  },
});

export { requestManagerSlice };
