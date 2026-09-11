export type IdeTarget = "idea" | "vscode";

export interface IdeConfig {
  target: IdeTarget;
  projectBasePath: string; // z. B. /home/user/workspace/my-service/src/main/java
}

export interface StackFrame {
  id: string;
  raw: string;
  className: string;
  methodName: string;
  fileName?: string;
  lineNumber?: number;
  isNative: boolean;
  isProjectCode: boolean;
}

export interface ParsedException {
  id: string;
  exceptionClass: string;
  message?: string;
  frames: StackFrame[];
  isCausedBy: boolean;
}

export interface ParsedStackTrace {
  exceptions: ParsedException[];
  rawText: string;
  timestamp?: string;
  threadName?: string;
}
