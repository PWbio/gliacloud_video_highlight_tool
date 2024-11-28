import { STATE_KEY_EXAMPLE } from "@/redux/constants";
import { rootReducer } from "@/redux/reducer";
import { createSlice, WithSlice } from "@reduxjs/toolkit";
import { InitialState } from "./type";

const initialState: InitialState = {};

const slice = createSlice({
  name: STATE_KEY_EXAMPLE,
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  selectors: {
    selectRootState: (state) => state,
  },
});

/* -------------- Inject Reducer -------------- */
declare module "@/redux/reducer" {
  export interface LazyLoadedSlices extends WithSlice<typeof slice> {}
}
const injectedSlice = slice.injectInto(rootReducer);

/** Actions */
export const { resetState } = slice.actions;

/** Selectors */
export const { selectRootState } = injectedSlice.selectors;
