import { combineSlices } from "@reduxjs/toolkit";
import { slice } from "./slices/root";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LazyLoadedSlices {}

export const rootReducer =
  combineSlices(slice).withLazyLoadedSlices<LazyLoadedSlices>();
