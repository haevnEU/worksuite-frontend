import React, { ChangeEvent, DragEvent, useState } from "react";
import {
  FileTerminal,
  Lock,
  Upload,
  Search,
  Clock,
  Code2,
  X,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export type SearchMode = "all" | "timestamp" | "logger_endpoint";

interface LogHeaderSectionProps {
  filesCount: number;
  maxFiles: number;
  onFilesSelect: (files: File[]) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  searchMode: SearchMode;
  onSearchModeChange: (mode: SearchMode) => void;
  selectedLogLevel?: string;
  onLogLevelChange?: (level: string) => void;
}

export const LogHeaderSection: React.FC<LogHeaderSectionProps> = ({
  filesCount,
  maxFiles,
  onFilesSelect,
  searchTerm,
  onSearchChange,
  searchMode,
  onSearchModeChange,
  selectedLogLevel = "ALL",
  onLogLevelChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showFilterGuide, setShowFilterGuide] = useState(false);
  const isLimitReached = filesCount >= maxFiles;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0 && !isLimitReached) {
      onFilesSelect(selectedFiles);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isLimitReached) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLimitReached) return;

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.type.includes("text") ||
        file.name.endsWith(".log") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".out"),
    );

    if (droppedFiles.length > 0) {
      onFilesSelect(droppedFiles);
    }
  };

  const getPlaceholderText = () => {
    switch (searchMode) {
      case "timestamp":
        return "Search by timestamp (e.g. 21:46:59, 2026-08-14, 21:4*)...";
      case "logger_endpoint":
        return "Search by logger, package, trace ID, or endpoint (e.g. LicenseService, /api/v1/license/renew)...";
      default:
        return "Search all log fields (timestamp, level, logger, endpoint, message, stacktrace)...";
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-[#10192c]/80 border rounded-2xl p-5 flex flex-col gap-4 backdrop-blur shadow-lg transition-all duration-200 ${
        isDragging
          ? "border-blue-500 bg-blue-500/10 scale-[0.99]"
          : "border-slate-800/80"
      }`}
    >
      {/* Top Row: Title, Shortcuts & Upload Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <FileTerminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-white tracking-wide">
                Log Viewer & Inspector
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Up to {maxFiles} Tabs
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
                ↓
              </kbd>{" "}
              Navigate Lines ·{" "}
              <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
                Click
              </kbd>{" "}
              Inspect Stacktrace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Open Logs:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                isLimitReached
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-blue-600 text-white"
              }`}
            >
              {filesCount} / {maxFiles}
            </span>
          </div>

          <label
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isLimitReached
                ? "bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-95"
            }`}
            title={
              isLimitReached
                ? `Maximum limit of ${maxFiles} logs open.`
                : "Upload log files (.log, .txt, .out)"
            }
          >
            {isLimitReached ? (
              <Lock className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{isLimitReached ? "Limit Reached" : "Add Log Files"}</span>
            <input
              type="file"
              accept=".log,.txt,.out,text/plain"
              multiple
              onChange={handleFileChange}
              disabled={isLimitReached}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Middle Row: Search & Filter Toolbar */}
      <div className="pt-2 border-t border-slate-800/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Mode Switcher */}
        <div className="flex items-center bg-[#0b111e] p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => onSearchModeChange("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              searchMode === "all"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onSearchModeChange("timestamp")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              searchMode === "timestamp"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Timestamp</span>
          </button>
          <button
            type="button"
            onClick={() => onSearchModeChange("logger_endpoint")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              searchMode === "logger_endpoint"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>Logger / Endpoint</span>
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={getPlaceholderText()}
            className="w-full bg-[#0b111e] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 transition-all font-mono"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Log Level Quick Filter Buttons */}
        {onLogLevelChange && (
          <div className="flex items-center gap-1 shrink-0 bg-[#0b111e] p-1 rounded-xl border border-slate-800">
            {["ALL", "ERROR", "WARN", "INFO", "DEBUG"].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onLogLevelChange(lvl)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider transition-colors cursor-pointer ${
                  selectedLogLevel === lvl
                    ? lvl === "ERROR"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : lvl === "WARN"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        )}

        {/* Filter Guide Toggle Button */}
        <button
          type="button"
          onClick={() => setShowFilterGuide((prev) => !prev)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
            showFilterGuide
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
              : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          title="Toggle search & filter documentation"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Guide</span>
          {showFilterGuide ? (
            <ChevronUp className="w-3 h-3 ml-0.5" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-0.5" />
          )}
        </button>
      </div>

      {/* Collapsible Filter Guide Section (English) */}
      {showFilterGuide && (
        <div className="mt-1 p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800/90 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Search & Filtering Guide</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Timestamp Mode */}
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>Timestamp Filter</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Matches ISO dates, exact clock times, or specific hour blocks.
              </p>
              <div className="space-y-1 text-[10px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-500">Exact time:</span>{" "}
                  <code className="text-indigo-300">21:46:59</code>
                </div>
                <div>
                  <span className="text-slate-500">Date prefix:</span>{" "}
                  <code className="text-indigo-300">2026-08-14</code>
                </div>
              </div>
            </div>

            {/* Logger / Endpoint Mode */}
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Code2 className="w-3.5 h-3.5" />
                <span>Logger & Endpoint</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Filters by Java class name, REST endpoint URI, or Trace ID.
              </p>
              <div className="space-y-1 text-[10px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-500">Service:</span>{" "}
                  <code className="text-indigo-300">LicenseService</code>
                </div>
                <div>
                  <span className="text-slate-500">REST URL:</span>{" "}
                  <code className="text-indigo-300">/api/v1/license/renew</code>
                </div>
              </div>
            </div>

            {/* General Log Level Quick Filter */}
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Search className="w-3.5 h-3.5" />
                <span>Global & Level Filter</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Combines free-text matching across message and stacktrace lines
                with log severity levels.
              </p>
              <div className="space-y-1 text-[10px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-500">Exception:</span>{" "}
                  <code className="text-indigo-300">PSQLException</code>
                </div>
                <div>
                  <span className="text-slate-500">Level:</span>{" "}
                  <code className="text-rose-400">ERROR</code> /{" "}
                  <code className="text-amber-400">WARN</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
