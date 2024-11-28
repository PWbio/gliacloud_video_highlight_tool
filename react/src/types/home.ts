export interface SentenceEntry {
  time: number;
  sentence: string;
  sentenceIndex: number;
}

export interface SectionEntry {
  title: string;
  sentences: SentenceEntry[];
}

export interface TranscriptData {
  data: SectionEntry[];
}

export interface TranscriptDataHash {
  [time: number]: {
    time: number;
    sentenceIndex: number;
    section: string;
    sentence: string;
  };
}

export type TranscriptTimeline = Record<number, number>; // { [second: number]: sentenceIndex }

export type TranscriptTimeCue = {
  start: number;
  end: number;
  sentenceIndex: number;
}[];

export type HighlightSentences = number[]; // sentenceIndex[]
