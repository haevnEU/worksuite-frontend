import React from "react";
import {
  Base64Tool,
  ApiRequestBuilder,
  EpochConverterTool,
  HashGeneratorTool,
  IdGeneratorTool,
  ToolsHeader,
  UrlEncoderTool,
} from "../components/tools";

export const ToolsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 font-sans text-slate-200">
      <ToolsHeader />
      <EpochConverterTool />
      <ApiRequestBuilder />
      <HashGeneratorTool />
      <IdGeneratorTool />
      <Base64Tool />
      <UrlEncoderTool />
    </div>
  );
};

export default ToolsPage;
