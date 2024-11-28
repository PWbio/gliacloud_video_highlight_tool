import { useAppSelector } from "@/hooks/reduxHooks";
import {
  selectHighlightSentences,
  selectTranscriptDataHash,
  selectVideoCurrentTime,
  selectVideoDuration,
} from "@/redux/slices/home/slice";
import React, { useRef, useState } from "react";
import styled from "styled-components";

interface VideoSliderProps {
  onSeek: (time: number) => void;
}

const VideoSlider: React.FC<VideoSliderProps> = ({ onSeek }) => {
  const duration = useAppSelector(selectVideoDuration);
  const currentTime = useAppSelector(selectVideoCurrentTime);
  const highlightSentences = useAppSelector(selectHighlightSentences);
  const transcriptDataHash = useAppSelector(selectTranscriptDataHash);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;

    if (isDragging) {
      onSeek(Math.min(Math.max(newTime, 0), duration));
    }
    setHoverTime(Math.min(Math.max(newTime, 0), duration));
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    onSeek(Math.min(Math.max(newTime, 0), duration));
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const generateGradient = () => {
    const defaultColor = "#374151";
    const highlightColor = "#3C82F6";
    if (duration === 0)
      return `to right, ${defaultColor} 0%, ${defaultColor} 100%`; // Handle case where duration is zero

    let gradient = `to right, ${defaultColor} 0%`;
    [...highlightSentences]
      .sort((a, b) => a - b)
      .forEach((idx) => {
        const startTime = transcriptDataHash[idx].time;
        let endTime = duration;
        if (idx < Object.keys(transcriptDataHash).length - 1) {
          const nextSentence = transcriptDataHash[idx + 1];
          endTime = nextSentence.time;
        }

        const startPercent = (startTime / duration) * 100;
        const endPercent = (endTime / duration) * 100;
        gradient += `, ${defaultColor} ${startPercent}%, ${highlightColor} ${startPercent}%, ${highlightColor} ${endPercent}%, ${defaultColor} ${endPercent}%`;
      });
    gradient += `, ${defaultColor} 100%`;
    return gradient;
  };

  const thumbPosition = (currentTime / duration) * 100;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <SliderContainer
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseMove={(e) => handleMouseMove(e as unknown as MouseEvent)}
      onMouseLeave={handleMouseLeave}
    >
      <Track $gradient={generateGradient()} />
      <Thumb $thumbPosition={thumbPosition} />
      {hoverTime !== null && (
        <TimeTooltip $position={(hoverTime / duration) * 100}>
          {formatTime(hoverTime)}
        </TimeTooltip>
      )}
    </SliderContainer>
  );
};

export default VideoSlider;

const SliderContainer = styled.div`
  position: relative;
  cursor: pointer;
  user-select: none;
  margin-top: 1rem;
`;

const Track = styled.div<{ $gradient: string }>`
  background: linear-gradient(${({ $gradient }) => $gradient});
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 30px; /* Thin red line */
  transform: translateY(-50%);
  border-radius: 5px;
`;

// ! using the attrs property for frequently changed styles
const Thumb = styled.div.attrs<{ $thumbPosition: number }>((props) => ({
  style: {
    left: `${props.$thumbPosition}%`,
  },
}))`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 30px;
  background: #fff;
  border: 2px solid #ea0f0f;
  border-radius: 4px; /* Rounded square */
`;

const TimeTooltip = styled.div.attrs<{ $position: number }>(props => ({
  style: {
    left: `${props.$position}%`,
  },
}))`
  position: absolute;
  bottom: 100%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
  pointer-events: none;
`;
