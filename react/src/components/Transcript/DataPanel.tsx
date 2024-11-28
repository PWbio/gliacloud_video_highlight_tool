import { useAppSelector } from "@/hooks/reduxHooks";
import { selectTranscriptData } from "@/redux/slices/home/slice";
import Section from "./Section";

const DataPanel = () => {
  const data = useAppSelector(selectTranscriptData);

  if (!data) return null;

  return <Section data={data} />;
};

export default DataPanel;
