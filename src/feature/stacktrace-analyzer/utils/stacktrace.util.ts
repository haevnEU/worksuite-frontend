import type { IdeConfig, StackFrame } from "../models/stacktrace.model";
import {
  ParsedException,
  ParsedStackTrace,
} from "../../../models/stacktraceAnalyzer.model.ts";

export const buildIdeUrl = (
  frame: StackFrame,
  config: IdeConfig,
): string | null => {
  if (!config.projectBasePath.trim() || !frame.fileName || frame.isNative) {
    return null;
  }

  let basePath = config.projectBasePath.trim().replace(/\\/g, "/");
  if (basePath.endsWith("/")) basePath = basePath.slice(0, -1);

  const packageDir = frame.className
    .substring(0, frame.className.lastIndexOf("."))
    .replace(/\./g, "/");
  const relativeFilePath = packageDir
    ? `${packageDir}/${frame.fileName}`
    : frame.fileName;

  const absolutePath = basePath.includes("/src/main/java")
    ? `${basePath}/${relativeFilePath}`
    : `${basePath}/src/main/java/${relativeFilePath}`;

  const line = frame.lineNumber ?? 1;

  if (config.target === "idea") {
    return `idea://open?file=${encodeURIComponent(absolutePath)}&line=${line}`;
  }
  return `vscode://file/${absolutePath}:${line}`;
};

const FRAME_REGEX =
  /^\s*at\s+([a-zA-Z0-9_$]+(?:\.[a-zA-Z0-9_$]+)*)\.([a-zA-Z0-9_$<>]+)\((.*?)\)/;
const CAUSED_BY_REGEX = /^Caused by:\s+([a-zA-Z0-9_$.]+)(?::\s*(.*))?$/;
const EXCEPTION_HEADER_REGEX =
  /^([a-zA-Z0-9_$.]+(?:Exception|Error|Throwable))(?::\s*(.*))?$/;

const FRAMEWORK_PREFIXES = [
  "java.",
  "javax.",
  "jakarta.",
  "org.springframework.",
  "org.apache.",
  "org.hibernate.",
  "com.zaxxer.hikari.",
  "io.netty.",
  "org.postgresql.",
  "com.fasterxml.jackson.",
  "org.junit.",
  "jdk.internal.",
];

export const parseJavaStackTrace = (raw: string): ParsedStackTrace => {
  const lines = raw.split(/\r?\n/).map((l) => l.trimEnd());
  const exceptions: ParsedException[] = [];

  let currentException: ParsedException | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    const causedMatch = line.match(CAUSED_BY_REGEX);
    if (causedMatch) {
      if (currentException) exceptions.push(currentException);
      currentException = {
        id: crypto.randomUUID(),
        exceptionClass: causedMatch[1],
        message: causedMatch[2] || undefined,
        frames: [],
        isCausedBy: true,
      };
      continue;
    }

    const frameMatch = line.match(FRAME_REGEX);
    if (frameMatch) {
      const className = frameMatch[1];
      const methodName = frameMatch[2];
      const location = frameMatch[3];

      let fileName: string | undefined;
      let lineNumber: number | undefined;
      let isNative = false;

      if (location === "Native Method") {
        isNative = true;
      } else if (location.includes(":")) {
        const parts = location.split(":");
        fileName = parts[0];
        lineNumber = parseInt(parts[1], 10) || undefined;
      } else {
        fileName = location;
      }

      const isFramework = FRAMEWORK_PREFIXES.some((p) =>
        className.startsWith(p),
      );

      const frame: StackFrame = {
        id: crypto.randomUUID(),
        raw: line.trim(),
        className,
        methodName,
        fileName,
        lineNumber,
        isNative,
        isProjectCode: !isFramework,
      };

      if (currentException) {
        currentException.frames.push(frame);
      }
      continue;
    }

    const headerMatch = line.match(EXCEPTION_HEADER_REGEX);
    if (headerMatch && !currentException) {
      currentException = {
        id: crypto.randomUUID(),
        exceptionClass: headerMatch[1],
        message: headerMatch[2] || undefined,
        frames: [],
        isCausedBy: false,
      };
      continue;
    }

    if (!currentException && line.includes("Exception")) {
      const parts = line.split(":");
      currentException = {
        id: crypto.randomUUID(),
        exceptionClass: parts[0].trim(),
        message: parts.slice(1).join(":").trim() || undefined,
        frames: [],
        isCausedBy: false,
      };
    }
  }

  if (currentException) {
    exceptions.push(currentException);
  }

  return {
    exceptions,
    rawText: raw,
  };
};
