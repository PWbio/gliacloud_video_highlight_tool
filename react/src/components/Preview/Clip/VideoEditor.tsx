import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { useRef, useState } from "react";
import VideoPlayer from "../VideoPlayer";

const VideoEditor = () => {
  const ffmpegRef = useRef(new FFmpeg());
  const ffmpeg = ffmpegRef.current;

  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Video file URL
  const [segments, setSegments] = useState<{ start: number; end: number }[]>(
    []
  ); // Stores start and end times of clips
  const [currentStart, setCurrentStart] = useState(0); // Start time for the current segment
  const [currentEnd, setCurrentEnd] = useState(0); // End time for the current segment
  const [outputVideo, setOutputVideo] = useState<string | null>(null); // Processed video

  // Load the video file
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoUrl(URL.createObjectURL(file));
    }
  };

  // Add a new segment
  const addSegment = () => {
    if (currentStart >= currentEnd) {
      alert("Start time must be less than end time");
      return;
    }
    setSegments([...segments, { start: currentStart, end: currentEnd }]);
  };

  // Process and join segments using ffmpeg.js
  const processSegments = async () => {
    ffmpeg.on("log", ({ message }) => {
      //   messageRef.current.innerHTML = message;
      console.log(message);
    });
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
    if (!ffmpeg.loaded)
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          "text/javascript"
        ),
      });

    // Load video file into FFmpeg
    const response = await fetch(videoUrl!);
    const videoData = new Uint8Array(await response.arrayBuffer());
    await ffmpeg.writeFile("input.mp4", videoData);

    // Process each segment
    const segmentFiles = [];
    for (let i = 0; i < segments.length; i++) {
      const { start, end } = segments[i];
      const output = `segment${i}.mp4`;

      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-ss",
        `${start}`,
        "-to",
        `${end}`,
        "-c",
        "copy",
        output,
      ]);
      segmentFiles.push(output);
    }

    // Concatenate segments
    const concatList = "concat.txt";
    const concatFileContent = segmentFiles
      .map((file) => `file '${file}'`)
      .join("\n");
    await ffmpeg.writeFile(concatList, concatFileContent);

    await ffmpeg.exec([
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatList,
      "-c",
      "copy",
      "output.mp4",
    ]);

    // Retrieve the output video
    const outputData = await ffmpeg.readFile("output.mp4");
    const outputBlob = new Blob([outputData], { type: "video/mp4" });
    setOutputVideo(URL.createObjectURL(outputBlob));

    console.log(outputVideo);
  };

  return (
    <div>
      <h1>Video Editor</h1>

      {/* Video Upload */}
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      {/* {videoUrl && <ReactPlayer url={videoUrl} controls width="100%" />} */}
      {videoUrl && <VideoPlayer videoUrl={videoUrl} />}

      {/* Segment Selection */}
      <div>
        <h2>Add Clip</h2>
        <label>
          Start Time (seconds):
          <input
            type="number"
            value={currentStart}
            onChange={(e) => setCurrentStart(Number(e.target.value))}
          />
        </label>
        <label>
          End Time (seconds):
          <input
            type="number"
            value={currentEnd}
            onChange={(e) => setCurrentEnd(Number(e.target.value))}
          />
        </label>
        <button onClick={addSegment}>Add Segment</button>
      </div>

      {/* List of Segments */}
      <div>
        <h2>Segments</h2>
        <ul>
          {segments.map((segment, index) => (
            <li key={index}>
              Segment {index + 1}: {segment.start}s - {segment.end}s
            </li>
          ))}
        </ul>
      </div>

      {/* Process and Join Segments */}
      <button onClick={processSegments}>Process and Join Segments</button>

      {/* Output Video */}
      {outputVideo && (
        <div>
          <h2>Output Video</h2>
          <VideoPlayer videoUrl={outputVideo} />
          <a href={outputVideo} download="output.mp4">
            Download
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoEditor;
