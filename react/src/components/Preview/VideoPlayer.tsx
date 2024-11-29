import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  selectTranscriptDataHash,
  selectTranscriptTimeline,
  selectVideoCurrentTime,
  selectVideoCurrentTimeInSeconds,
  selectVideoJumpTime,
  selectVideoUrl,
  setVideoCurrentTime,
  setVideoCurrentTimeInSeconds,
  setVideoJumpTime,
} from "@/redux/slices/home/slice";
import {
  CaretRightOutlined,
  FullscreenOutlined,
  PauseOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import VideoSlider from "./VideoSlider";
import { useHighlightPlayback } from "./useHighlightPlayback";

const VideoPlayer = () => {
  const dispatch = useAppDispatch();

  // Simple individual selectors
  const videoUrl = useAppSelector(selectVideoUrl);
  const currentTime = useAppSelector(selectVideoCurrentTime);
  const currentTimeInSeconds = useAppSelector(selectVideoCurrentTimeInSeconds);
  const videoJumpTime = useAppSelector(selectVideoJumpTime);
  const transcriptDataHash = useAppSelector(selectTranscriptDataHash);
  const transcriptTimeline = useAppSelector(selectTranscriptTimeline);

  // Group related state and refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout>();

  // Local state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("");
  const [isControlsVisible, setIsControlsVisible] = useState(true);

  const {
    isPlayingHighlights,
    playHighlights,
    stopHighlights,
    cleanup,
    hasHighlights,
  } = useHighlightPlayback(videoRef);

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Video control functions
  const videoControls = {
    togglePlayPause: () => {
      const video = videoRef.current;
      if (!video) return;

      // Handle highlight playback
      if (hasHighlights) {
        if (isPlayingHighlights) {
          stopHighlights();
        } else {
          playHighlights();
        }
        return;
      }

      // Handle normal video playback
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    },

    handleTimeUpdate: () => {
      const currentTime = videoRef.current?.currentTime || 0;
      dispatch(setVideoCurrentTime(currentTime));
      dispatch(setVideoCurrentTimeInSeconds(Math.floor(currentTime)));
    },

    handleSeek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        dispatch(setVideoCurrentTime(time));
        dispatch(setVideoJumpTime(time));
      }
    },

    jumpToTime: (seconds: number) => {
      if (videoRef.current) {
        const newTime = videoRef.current.currentTime + seconds;
        videoRef.current.currentTime = newTime;
        dispatch(setVideoCurrentTime(newTime));
      }
    },

    toggleFullScreen: () => {
      const parent = videoRef.current?.parentElement;
      if (!parent) return;

      if (!document.fullscreenElement) {
        parent.requestFullscreen().catch((err) => {
          console.error(`Fullscreen error: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    },
  };

  // Add event handlers for play/pause state sync
  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  // UI control functions
  const handleMouseMove = useCallback(() => {
    if (mouseMoveTimeoutRef.current) {
      clearTimeout(mouseMoveTimeoutRef.current);
    }

    mouseMoveTimeoutRef.current = setTimeout(() => {
      setIsControlsVisible(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      if (document.fullscreenElement) {
        controlsTimeoutRef.current = setTimeout(() => {
          setIsControlsVisible(false);
        }, 1000);
      }
    }, 100);

    // Clean up timeouts on unmount
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
    };
  }, []);

  // Update video current time when currentTime changes manually
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = videoJumpTime;
    }
  }, [videoJumpTime]);

  // Add this effect to update current subtitle
  useEffect(() => {
    if (!transcriptTimeline) return;

    const sentenceIndex = transcriptTimeline[Math.floor(currentTimeInSeconds)];
    const currentSentence = transcriptDataHash[sentenceIndex]?.sentence;
    setCurrentSubtitle(currentSentence || "");
  }, [currentTimeInSeconds, transcriptTimeline, transcriptDataHash]);

  if (!videoUrl) return null;

  return (
    <>
      <Flex vertical gap={16}>
        <VideoContainer>
          <VideoWrapper onMouseMove={handleMouseMove}>
            <video
              ref={videoRef}
              onTimeUpdate={videoControls.handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
              src={videoUrl}
              controls={false}
            />
            {currentSubtitle && (
              <SubtitleOverlay>{currentSubtitle}</SubtitleOverlay>
            )}
            <FullscreenControls $isVisible={isControlsVisible}>
              <Flex
                justify="space-between"
                align="center"
                style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
              >
                <Typography.Text
                  style={{ whiteSpace: "nowrap", color: "white" }}
                >
                  <span>{formatTime(currentTime)}</span>
                </Typography.Text>

                <Button
                  onClick={() => videoControls.jumpToTime(-10)}
                  type="text"
                >
                  <StepBackwardOutlined />
                </Button>
                <Button onClick={videoControls.togglePlayPause} type="text">
                  {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
                </Button>
                <Button
                  onClick={() => videoControls.jumpToTime(10)}
                  type="text"
                >
                  <StepForwardOutlined />
                </Button>

                <Button onClick={videoControls.toggleFullScreen} type="text">
                  <FullscreenOutlined />
                </Button>
              </Flex>
            </FullscreenControls>
          </VideoWrapper>
        </VideoContainer>

        <VideoSlider onSeek={videoControls.handleSeek} />
      </Flex>
    </>
  );
};

export default VideoPlayer;

const SubtitleOverlay = styled.div`
  position: absolute;
  bottom: 18%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  text-align: center;
  max-width: 80%;
  font-size: 1rem;
  z-index: 1;
  text-shadow: 1.006px 0.503px 1.006px rgba(0, 0, 0, 0.7);
`;

const FullscreenControls = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  z-index: 2;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;

  .ant-btn {
    color: white;
    &:hover {
      color: #1890ff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

const VideoContainer = styled.div`
  position: relative;
  flex: 1 0 auto;
  width: 100%;
  height: 100%;
  background-color: #000;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  video {
    width: auto;
    height: 100%;
    aspect-ratio: 16 / 9;
  }

  &:fullscreen {
    background: black;
    width: 100vw;
    height: 100vh;
  }

  &:-webkit-full-screen {
    background: black;
    width: 100vw;
    height: 100vh;
  }

  /* Only show controls on hover when NOT in fullscreen */
  &:not(:fullscreen):hover ${FullscreenControls} {
    opacity: 1;
  }
`;

// Helper function to format time in hh:mm:ss
const formatTime = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
