import React from "react";
import { Bug } from "lucide-react";
import { AiOverlayDrawer } from "../../ai-assistant";
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
  const rootCause =
    analysis && analysis.exceptions.length > 0
      ? analysis.exceptions[analysis.exceptions.length - 1]
      : null;

  return (
    <AiOverlayDrawer
      buttonLabel="AI Root Cause Analysis"
      buttonBadge={analysis ? analysis.exceptions.length : undefined}
      isDisabled={!analysis || analysis.exceptions.length === 0}
      title="AI Stacktrace & Root-Cause Diagnosis"
      icon={<Bug className="w-4 h-4 text-rose-400" />}
      subtitle={
        <span>
          Root Cause:{" "}
          <strong className="font-mono text-rose-300">
            {rootCause?.exceptionClass || "None"}
          </strong>
        </span>
      }
      loadingTitle="Analyzing Java Stacktrace..."
      loadingSubtitle="Evaluating exception chains, causal links, and project frames."
      emptyMessage="No parsed stacktrace available to analyze."
      systemPrompt={STACKTRACE_ANALYSIS_SYSTEM_PROMPT}
      temperature={0.15}
      getPrompt={() => (analysis ? buildStackTracePrompt(analysis) : "")}
    />
  );
};
