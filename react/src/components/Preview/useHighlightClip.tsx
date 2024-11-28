import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { 
  selectHighlightSentences, 
  selectTranscriptDataHash,
  setHighlightClipUrl,
  setIsShowingHighlights 
} from '@/redux/slices/home/slice';

export const useHighlightClip = () => {
  const dispatch = useAppDispatch();
  const highlightSentences = useAppSelector(selectHighlightSentences);
  const transcriptDataHash = useAppSelector(selectTranscriptDataHash);

  const generateHighlightClip = async (videoUrl: string) => {
    if (!highlightSentences.length) return null;

    try {
      // Sort highlight sentences by time
      const timeSegments = highlightSentences
        .map(sentenceIndex => ({
          start: transcriptDataHash[sentenceIndex].time,
          // Assuming each sentence takes about 3 seconds, or you can calculate based on next sentence
          duration: 3
        }))
        .sort((a, b) => a.start - b.start);

      // Here you would:
      // 1. Download the video
      // 2. Cut the segments
      // 3. Concatenate them
      // 4. Generate a new video URL
      
      // This is a placeholder - you'll need to implement actual video processing
      const processedVideoUrl = await processVideo(videoUrl, timeSegments);
      
      dispatch(setHighlightClipUrl(processedVideoUrl));
      dispatch(setIsShowingHighlights(true));

      return processedVideoUrl;
    } catch (error) {
      console.error('Error generating highlight clip:', error);
      return null;
    }
  };

  const toggleHighlightView = (show: boolean) => {
    dispatch(setIsShowingHighlights(show));
  };

  return {
    generateHighlightClip,
    toggleHighlightView,
  };
};

// Helper function to process video (implementation depends on your video processing library)
async function processVideo(
  videoUrl: string, 
  segments: Array<{ start: number; duration: number }>
): Promise<string> {
  // This is where you'd implement the actual video processing
  // You might use FFmpeg.js, WebCodecs API, or a backend service
  
  // For now, returning the original URL
  return videoUrl;
}