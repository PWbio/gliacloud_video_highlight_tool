import { createSlice } from "@reduxjs/toolkit";
import { STATE_KEY_ROOT } from "../constants";

const initialState = {};

export const slice = createSlice({
  name: STATE_KEY_ROOT,
  initialState,
  reducers: {
    resetState: () => initialState,
  },
});

/** Actions */
export const { resetState } = slice.actions;
