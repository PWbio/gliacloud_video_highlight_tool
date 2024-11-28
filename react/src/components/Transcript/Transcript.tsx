import { Typography } from "antd";
import styled from "styled-components";
import DataPanel from "./DataPanel";

const Transcript = () => {
  return (
    <SContainer>
      <Typography.Title level={2}>Transcript</Typography.Title>
      <DataPanel />
    </SContainer>
  );
};

export default Transcript;

const SContainer = styled.div`
  background-color: #f3f4f6;
  height: 100%;
  padding: 1rem;
  overflow: auto;

  position: absolute;
  inset: 0;
`;
