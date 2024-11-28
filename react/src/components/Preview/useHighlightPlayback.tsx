import { useAppSelector } from "@/hooks/reduxHooks";
import {
  selectHighlightSentences,
  selectTranscriptTimeCue,
  selectVideoJumpCount,
} from "@/redux/slices/home/slice";
import { useCallback, useEffect, useRef, useState } from "react";

// Define the structure of a highlight segment
interface HighlightSegment {
  start: number;
  end: number;
  sentenceIndex: number;
}

// Custom hook for handling highlight playback
export const useHighlightPlayback = (
  videoRef: React.RefObject<HTMLVideoElement>
) => {
  // State & Refs
  const [isPlayingHighlights, setIsPlayingHighlights] = useState(false);
  const currentSegmentIndexRef = useRef<number>(0);
  const timeUpdateListenerRef = useRef<(() => void) | null>(null);

  // Selectors
  const highlightSentences = useAppSelector(selectHighlightSentences);
  const transcriptTimeCue = useAppSelector(selectTranscriptTimeCue);
  const videoJumpCount = useAppSelector(selectVideoJumpCount);

  // Helper function to find the current segment index based on current time
  const findCurrentSegmentIndex = useCallback(
    (currentTime: number, segments: HighlightSegment[]): number => {
      // If current time is before first segment, start from beginning
      if (currentTime < segments[0].start) {
        return 0;
      }

      // Find the appropriate segment
      for (let i = 0; i < segments.length; i++) {
        if (currentTime >= segments[i].start && currentTime < segments[i].end) {
          return i;
        }
      }

      // If not found in any segment, start from beginning
      return 0;
    },
    []
  );

  // Function to stop playing highlights
  const stopHighlights = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlayingHighlights(false);
  }, [videoRef]);

  // Function to clean up event listeners
  const cleanupEventListeners = useCallback(() => {
    if (videoRef.current && timeUpdateListenerRef.current) {
      videoRef.current.removeEventListener(
        "timeupdate",
        timeUpdateListenerRef.current
      );
      timeUpdateListenerRef.current = null;
    }
  }, [videoRef]);

  // Function to handle time updates
  const handleTimeUpdate = useCallback(
    (segments: HighlightSegment[]) => {
      return () => {
        if (!videoRef.current || segments.length === 0) return;

        const currentTime = videoRef.current.currentTime;
        const currentSegment = segments[currentSegmentIndexRef.current];

        if (!currentSegment) {
          stopHighlights();
          return;
        }

        // Check if we've reached the end of current segment
        if (currentTime >= currentSegment.end) {
          // Move to next segment
          currentSegmentIndexRef.current++;

          // If there are more segments, jump to the next one
          if (currentSegmentIndexRef.current < segments.length) {
            videoRef.current.currentTime =
              segments[currentSegmentIndexRef.current].start;
          } else {
            // No more segments to play
            stopHighlights();
          }
        }
      };
    },
    [videoRef, stopHighlights]
  );

  // Function to start playing highlights
  const playHighlights = useCallback(() => {
    if (!videoRef.current || !highlightSentences.length) return;

    // Calculate highlight segments in real-time
    const currentTime = videoRef.current.currentTime;
    const segments = highlightSentences
      .map((sentenceIndex) => {
        const timeCue = transcriptTimeCue[sentenceIndex];
        return {
          start: timeCue.start,
          end: timeCue.end + 1,
          sentenceIndex,
        };
      })
      .sort((a, b) => a.start - b.start);
    if (segments.length === 0) return;

    cleanupEventListeners();

    const onTimeUpdate = handleTimeUpdate(segments);
    timeUpdateListenerRef.current = onTimeUpdate;
    videoRef.current.addEventListener("timeupdate", onTimeUpdate);

    currentSegmentIndexRef.current = findCurrentSegmentIndex(
      currentTime,
      segments
    );

    // start from the first segments
    const currentSegment = segments[currentSegmentIndexRef.current];
    if (currentSegment) {
      videoRef.current.currentTime = currentSegment.start;
    }
    videoRef.current.play();
    setIsPlayingHighlights(true);
  }, [
    videoRef,
    highlightSentences,
    transcriptTimeCue,
    findCurrentSegmentIndex,
    handleTimeUpdate,
    cleanupEventListeners,
  ]);

  // Cleanup function
  const cleanup = useCallback(() => {
    cleanupEventListeners();
    setIsPlayingHighlights(false);
  }, [cleanupEventListeners]);

  // Handle video jump
  useEffect(() => {
    stopHighlights();
  }, [videoJumpCount, stopHighlights]);

  // Return the state and control functions

  return {
    isPlayingHighlights,
    playHighlights,
    stopHighlights,
    cleanup,
    hasHighlights: highlightSentences.length > 0,
  };
};
