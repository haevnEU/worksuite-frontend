import React from "react";
import { AiOverlayDrawer, useAI } from "../../ai-assistant";
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
  const { assistantName } = useAI();

  return (
    <AiOverlayDrawer
      buttonBadge={totalFilteredCount}
      isDisabled={entries.length === 0}
      title={`${assistantName} Log Analysis & Patterns`}
      subtitle={
        <span>
          Sample: <strong>{Math.min(entries.length, 25)}</strong> of{" "}
          {totalFilteredCount} entries
        </span>
      }
      loadingSubtitle="Aggregating error patterns and root cause chains via local model."
      emptyMessage="No log entries match the current filter."
      systemPrompt={LOG_ANALYSIS_SYSTEM_PROMPT}
      getPrompt={() => buildLogSummaryPrompt(entries, totalFilteredCount)}
    />
  );
};
