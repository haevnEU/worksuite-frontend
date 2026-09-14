export type IdeTarget = "idea" | "vscode";

export interface IdeConfig {
  target: IdeTarget;
  projectBasePath: string;
}

export interface StackFrame {
  id: string;
  rawText: string;
  className: string;
  methodName: string;
  fileName?: string;
  lineNumber?: number;
  isNative: boolean;
  isProjectCode: boolean;
}

export interface ExceptionNode {
  id: string;
  exceptionClass: string;
  message?: string;
  isCausedBy: boolean;
  frames: StackFrame[];
}

export interface ParsedStackTrace {
  rawText: string;
  exceptions: ExceptionNode[];
}
