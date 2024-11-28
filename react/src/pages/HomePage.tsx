import { Col, Row } from "antd";
import Preview from "../components/Preview";
import Transcript from "../components/Transcript";

const HomePage = () => {
  return (
    <Row style={{ width: "100vw", height: "100vh" }}>
      <Col xs={{ span: 24, order: 2 }} sm={{ span: 12, order: 1 }}>
        <Transcript />
      </Col>
      <Col xs={{ span: 24, order: 1 }} sm={{ span: 12, order: 2 }}>
        <Preview />
      </Col>
    </Row>
  );
};

export default HomePage;
