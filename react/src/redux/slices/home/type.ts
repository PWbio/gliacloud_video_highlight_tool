import {
  HighlightSentences,
  TranscriptData,
  TranscriptDataHash,
  TranscriptTimeCue,
  TranscriptTimeline,
} from "@/types/home";

export interface InitialState {
  videoUrl: string | null;
  videoDuration: number;
  videoCurrentTime: number; // Real-time video current time in milliseconds
  videoCurrentTimeInSeconds: number; // Real-time video current time in seconds
  videoJumpCount: number; // Video action counts made by the user. Watch this state to make side effects.
  transcriptData: TranscriptData["data"] | null;
  transcriptDataHash: TranscriptDataHash;
  transcriptTimeline: TranscriptTimeline;
  transcriptTimeCue: TranscriptTimeCue;
  highlightSentences: HighlightSentences;
}

export default InitialState;