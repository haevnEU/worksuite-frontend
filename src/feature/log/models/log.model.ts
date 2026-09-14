export type LogLevel =
  "FATAL" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE" | "UNKNOWN";

export type SearchMode = "all" | "timestamp" | "logger_endpoint";

export interface LogEntry {
  id: string;
  lineNumber: number;
  timestamp?: string;
  level: LogLevel;
  logger?: string;
  message: string;
  rawText: string;
}

export interface ParsedLogFile {
  id: string;
  fileName: string;
  totalLines: number;
  entries: LogEntry[];
  levelCounts: Record<LogLevel, number>;
}
