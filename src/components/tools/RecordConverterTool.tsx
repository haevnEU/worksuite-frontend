import React, { useMemo, useState } from "react";
import {
  FileCode2,
  Copy,
  Check,
  ArrowRightLeft,
  Settings2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  convertJsonToJavaRecords,
  convertJavaRecordToJson,
  RecordConverterOptions,
} from "../../utils/recordConverter.util.ts";

const SAMPLE_JSON = `{
  "id": "usr_9981",
  "first_name": "Nils",
  "email_address": "nils@example.com",
  "is_active": true,
  "role_count": 3,
  "created_at": "2026-09-12T02:00:00Z",
  "permissions": ["READ", "WRITE", "DEPLOY"],
  "company": {
    "name": "WorkSuite Systems",
    "country_code": "DE"
  }
}`;

export const RecordConverterTool: React.FC = () => {
  const [direction, setDirection] = useState<"JSON_TO_JAVA" | "JAVA_TO_JSON">(
    "JSON_TO_JAVA",
  );
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON);
  const [javaInput, setJavaInput] = useState<string>(
    `public record UserDto(\n    @JsonProperty("user_id") String userId,\n    String name,\n    int age,\n    boolean active\n) {}`,
  );

  const [options, setOptions] = useState<RecordConverterOptions>({
    rootRecordName: "UserResponseDto",
    useJacksonAnnotations: true,
    useBeanValidation: true,
    usePrimitiveTypes: true,
  });

  const [copied, setCopied] = useState(false);

  // Umwandlung berechnen
  const outputResult = useMemo(() => {
    if (direction === "JSON_TO_JAVA") {
      return convertJsonToJavaRecords(jsonInput, options);
    } else {
      const res = convertJavaRecordToJson(javaInput);
      return { code: res.json, error: res.error };
    }
  }, [direction, jsonInput, javaInput, options]);

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSwitchDirection = () => {
    if (direction === "JSON_TO_JAVA") {
      if (outputResult.code && !outputResult.error) {
        setJavaInput(outputResult.code);
      }
      setDirection("JAVA_TO_JSON");
    } else {
      if (outputResult.code && !outputResult.error) {
        setJsonInput(outputResult.code);
      }
      setDirection("JSON_TO_JAVA");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-xl space-y-5">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shrink-0">
            <FileCode2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              JSON <span className="text-indigo-400">↔</span> Java Record
              Converter
            </h2>
            <p className="text-[11px] text-slate-400">
              Generate modern nested Java 21+ records with Jackson & Jakarta
              Validation from JSON payloads.
            </p>
          </div>
        </div>

        {/* Direction Switcher */}
        <button
          type="button"
          onClick={handleSwitchDirection}
          className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            {direction === "JSON_TO_JAVA"
              ? "Mode: JSON → Java Record"
              : "Mode: Java Record → JSON"}
          </span>
        </button>
      </div>

      {/* Options Bar (nur bei JSON -> Java aktiv) */}
      {direction === "JSON_TO_JAVA" && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs">
          <div className="flex items-center gap-2">
            <Settings2 className="w-3.5 h-3.5 text-slate-500" />
            <label className="font-semibold text-slate-400">Record Name:</label>
            <input
              type="text"
              value={options.rootRecordName}
              onChange={(e) =>
                setOptions({ ...options, rootRecordName: e.target.value })
              }
              className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={options.useJacksonAnnotations}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    useJacksonAnnotations: e.target.checked,
                  })
                }
                className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
              />
              <span>@JsonProperty</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={options.useBeanValidation}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    useBeanValidation: e.target.checked,
                  })
                }
                className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
              />
              <span>Bean Validation (@NotNull/@NotBlank)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={options.usePrimitiveTypes}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    usePrimitiveTypes: e.target.checked,
                  })
                }
                className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
              />
              <span>Primitive Types (int, boolean)</span>
            </label>
          </div>
        </div>
      )}

      {/* Editor Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Linke Seite: Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {direction === "JSON_TO_JAVA"
                ? "JSON Payload"
                : "Java Record Code"}
            </label>
            {direction === "JSON_TO_JAVA" && (
              <button
                type="button"
                onClick={() => setJsonInput(SAMPLE_JSON)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Load Sample
              </button>
            )}
          </div>

          <textarea
            rows={15}
            value={direction === "JSON_TO_JAVA" ? jsonInput : javaInput}
            onChange={(e) =>
              direction === "JSON_TO_JAVA"
                ? setJsonInput(e.target.value)
                : setJavaInput(e.target.value)
            }
            placeholder={
              direction === "JSON_TO_JAVA"
                ? "Paste JSON object or array here..."
                : "Paste Java record declaration here..."
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Rechte Seite: Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {direction === "JSON_TO_JAVA"
                ? "Generated Java 21+ Record"
                : "Generated JSON Template"}
            </label>
            <button
              type="button"
              disabled={!outputResult.code || !!outputResult.error}
              onClick={() => handleCopy(outputResult.code)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white cursor-pointer disabled:opacity-40"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy Code</span>
            </button>
          </div>

          {outputResult.error ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-900/50 bg-rose-950/20 p-3.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-mono">
                {outputResult.error}
              </span>
            </div>
          ) : (
            <pre className="max-h-[380px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-indigo-300 leading-relaxed select-text scrollbar-thin scrollbar-thumb-slate-800">
              {outputResult.code || "// Output will appear here..."}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
