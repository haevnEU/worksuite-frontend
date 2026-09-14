import type { LogEntry, LogLevel, ParsedLogFile } from "../models/log.model";

const LOG_LEVELS: LogLevel[] = [
  "FATAL",
  "ERROR",
  "WARN",
  "INFO",
  "DEBUG",
  "TRACE",
];

const INITIAL_LEVEL_COUNTS: Record<LogLevel, number> = {
  FATAL: 0,
  ERROR: 0,
  WARN: 0,
  INFO: 0,
  DEBUG: 0,
  TRACE: 0,
  UNKNOWN: 0,
};

const SPRING_LOG_REGEX =
  /^(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:[.,]\d{3})?)\s+(FATAL|ERROR|WARN|INFO|DEBUG|TRACE)\s+(?:\[.*?\])?\s*(.*?)\s*:\s*(.*)$/;

export const parseRawLogText = (
  fileName: string,
  rawContent: string,
): ParsedLogFile => {
  const lines = rawContent.split(/\r?\n/);
  const entries: LogEntry[] = [];
  const levelCounts = { ...INITIAL_LEVEL_COUNTS };

  let currentEntry: LogEntry | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const match = line.match(SPRING_LOG_REGEX);

    if (match) {
      if (currentEntry) {
        entries.push(currentEntry);
      }

      const level = match[2] as LogLevel;
      levelCounts[level] = (levelCounts[level] || 0) + 1;

      currentEntry = {
        id: `${fileName}-${entries.length + 1}`,
        lineNumber: i + 1,
        timestamp: match[1],
        level,
        logger: match[3],
        message: match[4],
        rawText: line,
      };
    } else {
      if (currentEntry) {
        currentEntry.rawText += `\n${line}`;
      } else {
        levelCounts.UNKNOWN += 1;
        entries.push({
          id: `${fileName}-${entries.length + 1}`,
          lineNumber: i + 1,
          level: "UNKNOWN",
          message: line,
          rawText: line,
        });
      }
    }
  }

  if (currentEntry) {
    entries.push(currentEntry);
  }

  return {
    id: `${fileName}-${Date.now()}`,
    fileName,
    totalLines: entries.length,
    entries,
    levelCounts,
  };
};
