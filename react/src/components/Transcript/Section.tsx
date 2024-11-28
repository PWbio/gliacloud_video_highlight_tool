import { SectionEntry } from "@/types/home";
import { Flex, Typography } from "antd";
import Sentence from "./Sentence";

const Section = ({ data }: { data: SectionEntry[] }) => {
  return (
    <Flex vertical gap={24}>
      {data.map((section) => (
        <Flex vertical key={section.title}>
          <Typography.Title level={4}>{section.title}</Typography.Title>
          <Sentence data={section.sentences} />
        </Flex>
      ))}
    </Flex>
  );
};

export default Section;
