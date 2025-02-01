import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

const createSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

export { createSlice };
