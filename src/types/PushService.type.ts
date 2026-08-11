export type Priority = "INFO" | "SUCCESS" | "WARN" | "ERROR" | "CRITICAL";

export type PriorityFilter = "all" | Priority;

export type ConnectionStatus =
  "connected" | "connecting" | "reconnecting" | "disconnected";
