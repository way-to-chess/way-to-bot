import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWithError } from "../../Models/IError.ts";
import { ERequestStatus } from "./RequestManagerModels.ts";

interface IRequestManagerSlice {
  [key: symbol]: {
    status: ERequestStatus;
    error?: string;
  };
}

const initialState: IRequestManagerSlice = {};

interface IWithSymbol {
  symbol: symbol;
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
      }: PayloadAction<IWithSymbol | { symbol: symbol[] }>,
    ) => {
      const symbols = Array.isArray(symbol) ? symbol : [symbol];

      symbols.forEach((s) => {
        delete state[s];
      });
    },
  },
  selectors: {
    statusBySymbol: (sliceState, symbol: symbol) =>
      sliceState[symbol]?.status ?? ERequestStatus.idle,
    errorBySymbol: (sliceState, symbol: symbol) =>
      sliceState[symbol].error ?? "Unknown Error",
  },
});

export { requestManagerSlice };
