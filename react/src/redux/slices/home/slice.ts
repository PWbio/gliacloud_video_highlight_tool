import { STATE_KEY_HOME } from "@/redux/constants";
import { rootReducer } from "@/redux/reducer";
import {
  TranscriptData,
  TranscriptDataHash,
  TranscriptTimeCue,
  TranscriptTimeline,
  VideoJumpState,
} from "@/types/home";
import { createSlice, PayloadAction, WithSlice } from "@reduxjs/toolkit";
import { InitialState } from "./type";

const initialState: InitialState = {
  videoUrl: null,
  videoDuration: 0,
  videoCurrentTime: 0,
  videoCurrentTimeInSeconds: 0,
  videoJumpState: {
    count: 0,
    time: 0,
  },
  transcriptData: null,
  transcriptDataHash: {},
  transcriptTimeline: [],
  transcriptTimeCue: [],
  highlightSentences: [],
};

const slice = createSlice({
  name: STATE_KEY_HOME,
  initialState,
  reducers: {
    resetState: () => initialState,
    setVideoUrl: (state, action: PayloadAction<string>) => {
      state.videoUrl = action.payload;
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.videoDuration = action.payload;
    },
    setVideoCurrentTime: (state, action: PayloadAction<number>) => {
      state.videoCurrentTime = action.payload;
    },
    setVideoCurrentTimeInSeconds: (state, action: PayloadAction<number>) => {
      state.videoCurrentTimeInSeconds = action.payload;
    },
    setVideoJumpTime: (state, action: PayloadAction<VideoJumpState["time"]>) => {
      state.videoJumpState.count = state.videoJumpState.count + 1;
      state.videoJumpState.time = action.payload
    },
    setVideoJumpCount: (state) => {
      state.videoJumpState.count = state.videoJumpState.count + 1;
    },
    setTranscriptData: (
      state,
      action: PayloadAction<TranscriptData["data"]>
    ) => {
      state.transcriptData = action.payload;
    },
    setTranscriptDataHash: (
      state,
      action: PayloadAction<TranscriptDataHash>
    ) => {
      state.transcriptDataHash = action.payload;
    },
    setTranscriptTimeline: (
      state,
      action: PayloadAction<TranscriptTimeline>
    ) => {
      state.transcriptTimeline = action.payload;
    },
    setTranscriptTimeCue: (state, action: PayloadAction<TranscriptTimeCue>) => {
      state.transcriptTimeCue = action.payload;
    },
    setHighlightSentences: (state, action: PayloadAction<number>) => {
      const isSelected = state.highlightSentences.includes(action.payload);
      const newSelected = isSelected
        ? state.highlightSentences.filter((t) => t !== action.payload)
        : [...state.highlightSentences, action.payload];

      state.highlightSentences = newSelected;
    },
  },
  selectors: {
    selectRootState: (state) => state,
    selectVideoUrl: (state) => state.videoUrl,
    selectVideoDuration: (state) => state.videoDuration,
    selectVideoCurrentTime: (state) => state.videoCurrentTime,
    selectVideoCurrentTimeInSeconds: (state) => state.videoCurrentTimeInSeconds,
    selectVideoJumpTime: (state) => state.videoJumpState.time,
    selectVideoJumpCount: (state) => state.videoJumpState.count,
    selectTranscriptData: (state) => state.transcriptData,
    selectTranscriptDataHash: (state) => state.transcriptDataHash,
    selectTranscriptTimeline: (state) => state.transcriptTimeline,
    selectTranscriptTimeCue: (state) => state.transcriptTimeCue,
    selectHighlightSentences: (state) => state.highlightSentences,
  },
});

/* -------------- Inject Reducer -------------- */
declare module "@/redux/reducer" {
  export interface LazyLoadedSlices extends WithSlice<typeof slice> { }
}
const injectedSlice = slice.injectInto(rootReducer);

/** Actions */
export const {
  resetState,
  setVideoUrl,
  setVideoDuration,
  setVideoCurrentTime,
  setVideoCurrentTimeInSeconds,
  setVideoJumpTime,
  setVideoJumpCount,
  setTranscriptData,
  setTranscriptDataHash,
  setTranscriptTimeline,
  setTranscriptTimeCue,
  setHighlightSentences,
} = slice.actions;

/** Selectors */
export const {
  selectRootState,
  selectVideoUrl,
  selectVideoDuration,
  selectVideoCurrentTime,
  selectVideoCurrentTimeInSeconds,
  selectVideoJumpTime,
  selectVideoJumpCount,
  selectTranscriptData,
  selectTranscriptDataHash,
  selectTranscriptTimeline,
  selectTranscriptTimeCue,
  selectHighlightSentences,
} = injectedSlice.selectors;
