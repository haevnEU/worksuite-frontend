import React, { useEffect, useState } from "react";
import {
  Bug,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Code2,
  FileText,
  HelpCircle,
  Info,
  Layers,
  Sparkles,
  Upload,
} from "lucide-react";
import { JavaStackTraceAnalyzer } from "../components/JavaStackTraceAnalyzer";
import type { ParsedStackTrace } from "../models/stacktrace.model";
import { parseJavaStackTrace } from "../utils/stacktrace.util";
import { StacktraceAiOverlay } from "../api";

export const StackTraceAnalyzerPage: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<ParsedStackTrace | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const triggerAnalysis = (textToParse: string) => {
    if (!textToParse.trim()) return;
    const result = parseJavaStackTrace(textToParse);
    setAnalysis(result);
    setInputText(textToParse);
  };

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      const pasted = e.clipboardData?.getData("text");
      if (
        pasted &&
        (pasted.includes("Exception") || pasted.includes("\tat "))
      ) {
        e.preventDefault();
        triggerAnalysis(pasted);
      }
    };
    window.addEventListener("paste", handleGlobalPaste);
    return () => window.removeEventListener("paste", handleGlobalPaste);
  }, []);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        triggerAnalysis(text);
      }
    } catch {}
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        triggerAnalysis(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="bg-[#10192c]/80 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner shrink-0">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-white tracking-wide">
                  Java Stacktrace Analyzer
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Root-Cause Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
                  Ctrl+V
                </kbd>{" "}
                Global Paste · Isolates Project Code · Filters Framework Noise
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="px-3.5 py-1.5 rounded-xl bg-[#0b111e] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Clipboard className="w-3.5 h-3.5 text-rose-400" />
              <span>Paste Clipboard</span>
            </button>

            <label className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-rose-600/20">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Trace</span>
              <input
                type="file"
                accept=".txt,.log,.out"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowGuide((prev) => !prev)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                showGuide
                  ? "bg-rose-600/20 border-rose-500/40 text-rose-300"
                  : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
              title="Toggle Analyzer Documentation"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guide</span>
              {showGuide ? (
                <ChevronUp className="w-3 h-3 ml-0.5" />
              ) : (
                <ChevronDown className="w-3 h-3 ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {showGuide && (
          <div className="mt-1 p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800/90 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold border-b border-slate-800 pb-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>Analyzer & Parser Guide</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>"Caused by" Resolution</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Automatically extracts nested causal chains and resolves the
                  deepest root exception.
                </p>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Noise Suppression</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Filters out standard Java, Spring, Tomcat, and Netty proxies
                  to reveal your company code immediately.
                </p>
              </div>

              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Input & Shortcuts</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Accepts raw console output, container timestamps (ISO), and
                  multiline stacktraces directly.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {!analysis && (
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Raw Stacktrace Input</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">
              Press Ctrl+V anywhere or paste below
            </span>
          </div>

          <textarea
            rows={14}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`org.springframework.dao.InvalidDataAccessApiUsageException: Could not deserialize string...
Caused by: com.fasterxml.jackson.databind.exc.InvalidDefinitionException: Cannot construct instance...
\tat org.springframework.orm.jpa.EntityManagerFactoryUtils.convertJpaAccessExceptionIfPossible(...)
\tat de.haevn.worksuite.settings.UserService.getUser(UserService.java:79)`}
            className="w-full bg-[#0b111e] border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500 transition leading-relaxed resize-y"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              disabled={!inputText.trim()}
              onClick={() => triggerAnalysis(inputText)}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Stacktrace</span>
            </button>
          </div>
        </div>
      )}

      {analysis && (
        <JavaStackTraceAnalyzer
          analysis={analysis}
          onClear={() => {
            setAnalysis(null);
            setInputText("");
          }}
        />
      )}
      <StacktraceAiOverlay analysis={analysis} />
    </div>
  );
};

export default StackTraceAnalyzerPage;
