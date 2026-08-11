export type LogLevel =
  "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL" | "UNKNOWN";

export interface LogEntry {
  id: string;
  lineNumber: number;
  timestamp?: string;
  level: LogLevel;
  logger?: string;
  message: string;
  rawText: string;
  ip?: string;
  httpMethod?: string;
  httpStatus?: number;
  httpPath?: string;
}

export interface ParsedLogFile {
  id: string;
  fileName: string;
  fileSize: number;
  entries: LogEntry[];
  totalLines: number;
  levelCounts: Record<LogLevel, number>;
}
