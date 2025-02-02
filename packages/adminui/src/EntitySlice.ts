import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const entityAdapter = createEntityAdapter();

const entitySelectors = entityAdapter.getSelectors();

const entitySlice = createSlice({
  name: "entity",
  initialState: entityAdapter.getInitialState(),
  reducers: {
    addEntity: entityAdapter.addOne,
    removeEntity: entityAdapter.removeOne,
  },
  selectors: {
    ...entitySelectors,
    selectExists: (sliceState, id: string) =>
      !!entitySelectors.selectById(sliceState, id),
  },
});

export { entitySlice };
