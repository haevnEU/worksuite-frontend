import React from "react";
import { Bug } from "lucide-react";
import { AiOverlayDrawer, useAI } from "../../ai-assistant";
import type { ParsedStackTrace } from "../models/stacktrace.model";
import {
  buildStackTracePrompt,
  STACKTRACE_ANALYSIS_SYSTEM_PROMPT,
} from "./prompts.ai";

interface StacktraceAiOverlayProps {
  analysis: ParsedStackTrace | null;
}

export const StacktraceAiOverlay: React.FC<StacktraceAiOverlayProps> = ({
  analysis,
}) => {
  const { assistantName } = useAI();

  const rootCause =
    analysis && analysis.exceptions.length > 0
      ? analysis.exceptions[analysis.exceptions.length - 1]
      : null;

  return (
    <AiOverlayDrawer
      buttonBadge={analysis ? analysis.exceptions.length : undefined}
      isDisabled={!analysis || analysis.exceptions.length === 0}
      title={`${assistantName} Root-Cause Diagnosis`}
      icon={<Bug className="w-4 h-4 text-rose-400" />}
      subtitle={
        <span>
          Root Cause:{" "}
          <strong className="font-mono text-rose-300">
            {rootCause?.exceptionClass || "None"}
          </strong>
        </span>
      }
      loadingSubtitle="Evaluating exception chains, causal links, and project frames."
      emptyMessage="No parsed stacktrace available to analyze."
      systemPrompt={STACKTRACE_ANALYSIS_SYSTEM_PROMPT}
      getPrompt={() => (analysis ? buildStackTracePrompt(analysis) : "")}
    />
  );
};
