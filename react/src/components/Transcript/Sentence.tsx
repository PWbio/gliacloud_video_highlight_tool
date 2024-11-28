import { useAppSelector } from "@/hooks/reduxHooks";
import {
  addVideoJumpCount,
  selectTranscriptTimeline,
  selectVideoCurrentTimeInSeconds,
  setHighlightSentences,
  setVideoCurrentTime,
} from "@/redux/slices/home/slice";
import { SentenceEntry } from "@/types/home";
import { Flex } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SentenceItem from "./SentenceItem";

const Sentence = ({ data }: { data: SentenceEntry[] }) => {
  const dispatch = useDispatch();
  const currentTimeInSeconds = useAppSelector(selectVideoCurrentTimeInSeconds);
  const [selectedSentences, setSelectedSentences] = useState<Set<number>>(
    new Set()
  );
  const sentenceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<
    number | null
  >(null);

  const transcriptTimeline = useAppSelector(selectTranscriptTimeline);
  const refCallbacks = useRef(
    new Map<number, (el: HTMLDivElement | null) => void>()
  );

  useEffect(() => {
    const sentenceIndex = transcriptTimeline[currentTimeInSeconds];
    if (typeof sentenceIndex !== "number") return;

    setCurrentSentenceIndex(sentenceIndex);
    if (
      currentSentenceIndex !== null &&
      sentenceRefs.current[currentSentenceIndex]
    ) {
      sentenceRefs.current[currentSentenceIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTimeInSeconds]);

  const handleSentenceClick = useCallback(
    (sentenceIndex: number) => {
      setSelectedSentences((prevSelected) => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(sentenceIndex)) {
          newSelected.delete(sentenceIndex);
        } else {
          newSelected.add(sentenceIndex);
        }
        return newSelected;
      });
      dispatch(setHighlightSentences(sentenceIndex));
      dispatch(addVideoJumpCount());
    },
    [dispatch]
  );

  const handleTimelineClick = useCallback(
    (time: number) => {
      dispatch(setVideoCurrentTime(time));
      dispatch(addVideoJumpCount());
    },
    [dispatch]
  );

  const bindRef = useCallback((sentenceIndex: number) => {
    if (!refCallbacks.current.has(sentenceIndex)) {
      refCallbacks.current.set(sentenceIndex, (el: HTMLDivElement | null) => {
        sentenceRefs.current[sentenceIndex] = el;
      });
    }
    return refCallbacks.current.get(sentenceIndex)!;
  }, []);

  const sentenceItems = useMemo(() => {
    return data.map((item) => (
      <SentenceItem
        key={item.sentenceIndex}
        item={item}
        isSelected={selectedSentences.has(item.sentenceIndex)}
        isCurrent={item.sentenceIndex === currentSentenceIndex}
        onSentenceClick={handleSentenceClick}
        onTimelineClick={handleTimelineClick}
        ref={bindRef(item.sentenceIndex)}
      />
    ));
  }, [
    data,
    selectedSentences,
    currentSentenceIndex,
    handleSentenceClick,
    handleTimelineClick,
    bindRef,
  ]);

  return (
    <Flex vertical gap={8}>
      {sentenceItems}
    </Flex>
  );
};

export default Sentence;
