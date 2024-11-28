import { ConfigProvider, theme, Typography } from "antd";
import styled from "styled-components";
import UploadButton from "./UploadButton";
import VideoPlayer from "./VideoPlayer";

const Preview = () => {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <SContainer>
        <Typography.Title level={2}>Preview</Typography.Title>
        <UploadButton />
        <VideoPlayer />
      </SContainer>
    </ConfigProvider>
  );
};

export default Preview;

const SContainer = styled.div`
  display: flex;
  flex-direction: column;

  background-color: #1f2a37;
  padding: 1rem;

  overflow: auto;
  position: absolute;
  inset: 0;
`;
