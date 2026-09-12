import React from "react";
import {
  Base64Tool,
  ApiRequestBuilder,
  EpochConverterTool,
  HashGeneratorTool,
  IdGeneratorTool,
  ToolsHeader,
  UrlEncoderTool,
  RegexTesterTool,
  RecordConverterTool,
} from "../components/tools";

export const ToolsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 font-sans text-slate-200">
      <ToolsHeader />
      <RegexTesterTool />
      <EpochConverterTool />
      <ApiRequestBuilder />
      <HashGeneratorTool />
      <IdGeneratorTool />
      <Base64Tool />
      <UrlEncoderTool />
      <RecordConverterTool />
    </div>
  );
};

export default ToolsPage;
