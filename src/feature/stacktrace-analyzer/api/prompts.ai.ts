import type {
  ExceptionNode,
  ParsedStackTrace,
} from "../models/stacktrace.model";

export const STACKTRACE_ANALYSIS_SYSTEM_PROMPT = `You are a Senior Java & Spring Backend Engineer.
Your task is to analyze Java stacktraces, isolate the exact root cause, explain why it occurred, and propose a clean, maintainable code fix.
Respond in structured Markdown with the following sections:
1. **Root Cause Diagnosis:** Direct explanation of what triggered the exception (1-2 sentences).
2. **Key Faulty Frames:** Pinpoint the problematic class and method calls in project code.
3. **Recommended Fix & Code Snippet:** Concrete Java/Spring code example showing how to prevent or handle this issue.
Keep explanations concise, technical, and without unnecessary conversational filler.`;

export const buildStackTracePrompt = (analysis: ParsedStackTrace): string => {
  const rootCause =
    analysis.exceptions.length > 0
      ? analysis.exceptions[analysis.exceptions.length - 1]
      : null;

  const chainSummary = analysis.exceptions
    .map((exc, idx) => {
      const prefix = idx === 0 ? "Initial" : `Caused by #${idx}`;
      return `${prefix}: ${exc.exceptionClass} - ${exc.message || "(No message)"}`;
    })
    .join("\n");

  const formatFrames = (exc: ExceptionNode) => {
    const projectFrames = exc.frames.filter((f) => f.isProjectCode);
    const targetFrames =
      projectFrames.length > 0 ? projectFrames : exc.frames.slice(0, 10);

    return targetFrames
      .map(
        (f) =>
          `  at ${f.className}.${f.methodName}(${f.fileName || "Unknown"}:${f.lineNumber || "?"})`,
      )
      .join("\n");
  };

  const framesText = rootCause
    ? formatFrames(rootCause)
    : "No stack frames available";

  return `Analyze the following Java stacktrace and provide a diagnosis and solution:

Exception Chain:
${chainSummary}

Root Cause Exception:
${rootCause ? rootCause.exceptionClass : "Unknown"}
Message: ${rootCause?.message || "(No message)"}

Relevant Stack Frames:
${framesText}

Raw snippet:
\`\`\`
${analysis.rawText.slice(0, 1500)}
\`\`\``;
};
