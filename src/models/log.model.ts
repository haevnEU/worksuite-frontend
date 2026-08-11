import { LogType } from "../types/log.types.ts";

export interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  args?: any[];
  timestamp: Date | string | number;
}
