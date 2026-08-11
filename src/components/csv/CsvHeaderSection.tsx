import React, { ChangeEvent, DragEvent, useState } from "react";
import {
  FileSpreadsheet,
  Lock,
  Upload,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Keyboard,
  Eye,
  Layers,
} from "lucide-react";

interface CsvHeaderSectionProps {
  filesCount: number;
  maxFiles: number;
  onFilesSelect: (files: File[]) => void;
}

export const CsvHeaderSection: React.FC<CsvHeaderSectionProps> = ({
  filesCount,
  maxFiles,
  onFilesSelect,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
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
    if (!isLimitReached) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLimitReached) return;

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "text/csv" || file.name.endsWith(".csv"),
    );

    if (droppedFiles.length > 0) {
      onFilesSelect(droppedFiles);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-[#10192c]/80 border rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg transition-all duration-200 ${
        isDragging
          ? "border-blue-500 bg-blue-500/10 scale-[0.99]"
          : "border-slate-800"
      }`}
    >
      {/* Top Row: Icon, Title, Badge & Guide Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                CSV Inspector
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Data Tools
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-tab CSV viewer with in-memory parsing, global search, and
              keyboard-driven inspection.
            </p>
          </div>
        </div>

        {/* Guide Toggle */}
        <button
          type="button"
          onClick={() => setShowGuide((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer self-start md:self-center shrink-0 ${
            showGuide
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
              : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          title="Toggle CSV inspector guide"
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

      {/* Collapsible Action & Keyboard Shortcuts Guide */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>CSV Inspector & Navigation Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Multi-tab Parsing */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>Multi-Tab Management</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Upload multiple CSV datasets simultaneously. Switch tabs to
                  compare structures without reloading.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>
                  Tab limit: {filesCount} / {maxFiles} active files
                </span>
              </div>
            </div>

            {/* 2. Keyboard Navigation */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                  <Keyboard className="w-3.5 h-3.5 shrink-0" />
                  <span>Keyboard Shortcuts</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Navigate seamlessly: Use{" "}
                  <kbd className="px-1 bg-slate-800 border border-slate-700 rounded font-mono text-[10px]">
                    ↑
                  </kbd>{" "}
                  /{" "}
                  <kbd className="px-1 bg-slate-800 border border-slate-700 rounded font-mono text-[10px]">
                    ↓
                  </kbd>{" "}
                  for rows, and{" "}
                  <kbd className="px-1 bg-slate-800 border border-slate-700 rounded font-mono text-[10px]">
                    Enter
                  </kbd>{" "}
                  to open details.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-cyan-300 border-t border-slate-800/40">
                <span>↑ / ↓ Switch · ESC Close</span>
              </div>
            </div>

            {/* 3. Detail Drawer */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span>Record Inspector Drawer</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Click any row to open full column breakdown, handles long
                  texts and null fields cleanly.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>1-Click deep row inspection</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Row: Shortcuts Breadcrumb & Upload Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-slate-400">
          <span>Shortcuts:</span>
          <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
            ↑
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
            ↓
          </kbd>{" "}
          <span>Rows</span>
          <span className="text-slate-600">·</span>
          <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
            ←
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
            →
          </kbd>{" "}
          <span>Cols</span>
          <span className="text-slate-600">·</span>
          <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
            Enter
          </kbd>{" "}
          <span>Details</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Files:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                isLimitReached
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-blue-600 text-white"
              }`}
            >
              {filesCount} / {maxFiles}
            </span>
          </div>

          <label
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isLimitReached
                ? "bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 active:scale-95"
            }`}
            title={
              isLimitReached
                ? `Maximum limit of ${maxFiles} files reached. Close a file to add more.`
                : "Upload CSV files (or drag & drop here)"
            }
          >
            {isLimitReached ? (
              <Lock className="w-4 h-4 text-slate-500" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{isLimitReached ? "Limit Reached" : "Add CSV Files"}</span>
            <input
              type="file"
              accept=".csv,text/csv"
              multiple
              onChange={handleFileChange}
              disabled={isLimitReached}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
