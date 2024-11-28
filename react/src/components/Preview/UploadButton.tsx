import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  selectVideoUrl,
  setTranscriptData,
  setTranscriptDataHash,
  setTranscriptTimeCue,
  setTranscriptTimeline,
  setVideoDuration,
  setVideoUrl,
} from "@/redux/slices/home/slice";
import {
  SectionEntry,
  SentenceEntry,
  TranscriptDataHash,
  TranscriptTimeCue,
  TranscriptTimeline,
} from "@/types/home";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { Alert, App, Button, Flex } from "antd";
import React, { useRef } from "react";
import { v4 } from "uuid";

const UploadButton = () => {
  const dispatch = useAppDispatch();
  const videoUrl = useAppSelector(selectVideoUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { notification } = App.useApp();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        const messageKey = v4();

        notification.info({
          key: messageKey,
          message: "Video Processing...",
          description: "Please wait while we process your video.",
          icon: <LoadingOutlined />,
          duration: 0,
        });

        // Make a POST request to the API with the video duration using fetch
        fetch("/api/ai-processing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ duration }),
        })
          .then(async (response) => {
            const data = await response.json();
            if (response.ok) {
              return data;
            } else {
              throw new Error(`${response.status} ${response.statusText}`);
            }
          })
          .then((data) => {
            dispatch(setVideoUrl(videoElement.src));
            dispatch(setVideoDuration(duration));
            dispatch(setTranscriptData(data.data));

            // First, flatten all sentences from all sections into a single array
            const allSentences = data.data.flatMap((section: SectionEntry) =>
              section.sentences.map((sentence) => ({
                ...sentence,
                section: section.title,
              }))
            );

            // Then process the flat array
            const timeline: TranscriptTimeline = {};
            const timeCues: TranscriptTimeCue = [];
            const dataHash = allSentences.reduce(
              (
                acc: TranscriptDataHash,
                sentence: SentenceEntry,
                index: number
              ) => {
                const startSecond = Math.floor(sentence.time);
                const nextSentence = allSentences[index + 1];
                const endSecond = nextSentence
                  ? Math.floor(nextSentence.time) - 1
                  : Math.floor(duration);

                // Add time cue
                timeCues.push({
                  start: startSecond,
                  end: endSecond,
                  sentenceIndex: sentence.sentenceIndex,
                });

                // Update timeline
                for (let second = startSecond; second <= endSecond; second++) {
                  timeline[second] = sentence.sentenceIndex;
                }

                // Update hash
                return {
                  ...acc,
                  [sentence.sentenceIndex]: sentence,
                };
              },
              {} as TranscriptDataHash
            );

            dispatch(setTranscriptDataHash(dataHash));
            dispatch(setTranscriptTimeline(timeline));
            dispatch(setTranscriptTimeCue(timeCues));

            notification.success({
              key: messageKey,
              message: "Video Processed!",
              description: "Please select a sentence to highlight.",
            });
          })
          .catch((error) => {
            console.error("Error Processing Video:", error);

            // Clear the file input on error
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }

            notification.error({
              message: error.message,
              description: "Please try again.",
            });
          });
      };
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {!videoUrl && (
        <Flex vertical gap={8}>
          <Alert
            message="Please upload a video to see the transcript."
            type="info"
            showIcon
          />
          <Button icon={<UploadOutlined />} onClick={handleButtonClick}>
            Click to Upload
          </Button>
        </Flex>
      )}
    </>
  );
};

export default UploadButton;
