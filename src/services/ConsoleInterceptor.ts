import { LogEntry } from "../models/log.model.ts";
import { LogType } from "../types/log.types.ts";

class ConsoleInterceptor {
  private listeners: Set<(entry: LogEntry) => void> = new Set();
  private buffer: LogEntry[] = [];
  private maxBufferSize = 500;
  private isInitialized = false;

  private originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  public init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Uncaught Window-Errors abfangen
    window.addEventListener("error", (event) => {
      this.captureLog("error", [
        `Uncaught Error: ${event.message}`,
        `at ${event.filename}:${event.lineno}:${event.colno}`,
      ]);
    });

    // Unhandled Promise Rejections abfangen
    window.addEventListener("unhandledrejection", (event) => {
      this.captureLog("error", ["Unhandled Promise Rejection:", event.reason]);
    });

    // Console-Methoden überschreiben und Type strikt beibehalten
    const levels: LogType[] = ["log", "info", "warn", "error"];

    levels.forEach((level) => {
      console[level] = (...args: any[]) => {
        // 1. Native Konsole weiterhin bedienen (für DevTools)
        this.originalConsole[level].apply(console, args);

        // 2. Im eigenen Buffer und Listener-Stream speichern
        this.captureLog(level, args);
      };
    });
  }

  private captureLog(type: LogType, args: any[]) {
    const formattedMessage = args
      .map((arg) => {
        if (arg instanceof Error) {
          return `${arg.name}: ${arg.message}\n${arg.stack || ""}`;
        }
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(" ");

    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type, // Bleibt exakt "log" | "info" | "warn" | "error"
      message: formattedMessage,
      args,
      timestamp: new Date(),
    };

    this.buffer.push(entry);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }

    this.listeners.forEach((listener) => listener(entry));
  }

  public getBuffer(): LogEntry[] {
    return [...this.buffer];
  }

  public subscribe(listener: (entry: LogEntry) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public clear() {
    this.buffer = [];
  }
}

export const consoleInterceptor = new ConsoleInterceptor();
