import React from "react";
import { AiOverlayDrawer } from "../../ai-assistant";
import type { LogEntry } from "../models/log.model";
import {
  buildLogSummaryPrompt,
  LOG_ANALYSIS_SYSTEM_PROMPT,
} from "./prompts.ai";

interface LogAiOverlayProps {
  entries: LogEntry[];
  totalFilteredCount: number;
}

export const LogAiOverlay: React.FC<LogAiOverlayProps> = ({
  entries,
  totalFilteredCount,
}) => {
  return (
    <AiOverlayDrawer
      buttonLabel="AI Log Analysis"
      buttonBadge={totalFilteredCount}
      isDisabled={entries.length === 0}
      title="AI Log Analysis & Patterns"
      subtitle={
        <span>
          Sample: <strong>{Math.min(entries.length, 25)}</strong> of{" "}
          {totalFilteredCount} entries
        </span>
      }
      loadingTitle="Analyzing log entries..."
      loadingSubtitle="Aggregating error patterns and root cause chains via local model."
      emptyMessage="No log entries match the current filter."
      systemPrompt={LOG_ANALYSIS_SYSTEM_PROMPT}
      temperature={0.15}
      getPrompt={() => buildLogSummaryPrompt(entries, totalFilteredCount)}
    />
  );
};
