import { PlayCircleOutlined } from "@ant-design/icons";
import { Flex, Typography } from "antd";
import React, { forwardRef } from "react";

interface SentenceItemProps {
  item: { sentenceIndex: number; time: number; sentence: string };
  isSelected: boolean;
  isCurrent: boolean;
  onSentenceClick: (sentenceIndex: number) => void;
  onTimelineClick: (time: number) => void;
  ref: React.RefObject<HTMLDivElement>;
}

const SentenceItem = forwardRef<HTMLDivElement, SentenceItemProps>(
  ({ item, isSelected, isCurrent, onSentenceClick, onTimelineClick }, ref) => {
    return (
      <div
        ref={ref}
        key={item.sentenceIndex}
        style={{
          cursor: "pointer",
          borderRadius: "5px",
          height: "100%",
          padding: "0.8rem",
          backgroundColor: isSelected ? "#3C82F6" : "white",
          border: isCurrent ? "3px solid #3cf6ac" : "none",
          userSelect: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isCurrent && (
          <PlayCircleOutlined
            style={{
              marginRight: "8px",
              color: isSelected ? "#fff" : "#3C82F6",
            }}
          />
        )}
        <Flex align="center" gap={8} style={{ width: "100%" }}>
          <Typography.Text
            strong
            style={{
              color: isSelected ? "#fff" : "#1e61e6",
              whiteSpace: "nowrap",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = isSelected ? "#5bfff7" : "#5e9cff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isSelected ? "#fff" : "#1e61e6";
            }}
            onClick={(e) => {
              onTimelineClick(item.time);
              e.stopPropagation();
            }}
          >
            {formatTime(item.time)}
          </Typography.Text>
          <div
            onClick={() => onSentenceClick(item.sentenceIndex)}
            style={{ width: "100%" }}
          >
            {item.sentence}
          </div>
        </Flex>
      </div>
    );
  }
);

export default React.memo(SentenceItem);

const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
};
