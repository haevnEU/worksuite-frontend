import type { LogEntry } from "../models/log.model";

export const LOG_ANALYSIS_SYSTEM_PROMPT = `You are a Senior Site Reliability Engineer and an expert in Java backend systems (Jakarta EE, RESTEasy, CDI, Hibernate).
Your task is to analyze log files accurately, identify error clusters, and provide actionable resolution steps.
Respond in structured Markdown using the following sections:
1. **Summary:** What happened? (1-2 sentences)
2. **Key Error Patterns:** Which exceptions/loggers dominate?
3. **Potential Causes & Mitigation Steps:** Concrete steps to resolve the issues.
Use concise and precise language without filler words.`;

export const buildLogSummaryPrompt = (
  entries: LogEntry[],
  totalFiltered: number,
): string => {
  const errorAndWarn = entries.filter(
    (e) => e.level === "ERROR" || e.level === "FATAL" || e.level === "WARN",
  );

  const targetSample = errorAndWarn.length > 0 ? errorAndWarn : entries;
  const sampleLines = targetSample
    .slice(0, 25)
    .map(
      (e) =>
        `[${e.timestamp || "N/A"}] ${e.level} [${e.logger || "Unknown"}]: ${e.message}`,
    )
    .join("\n");

  return `Analyze the following log entries (sample of ${targetSample.length} out of ${totalFiltered} total filtered entries):

${sampleLines}

Provide a concise diagnosis of the anomalies and failures encountered.`;
};
