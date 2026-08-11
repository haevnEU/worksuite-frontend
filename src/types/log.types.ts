import { LogEntry } from "../models/log.model.ts";

export type LogType = "log" | "error" | "warn" | "info";
export type LogListener = (entry: LogEntry) => void;
