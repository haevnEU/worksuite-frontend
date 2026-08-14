import React, { ChangeEvent, DragEvent, useState } from "react";
import { FileSpreadsheet, Lock, Upload } from "lucide-react";

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
      className={`bg-[#10192c]/80 border rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg transition-all duration-200 ${
        isDragging
          ? "border-blue-500 bg-blue-500/10 scale-[0.99]"
          : "border-slate-800"
      }`}
    >
      {/* Linke Seite: Icon, Titel, Badge & Keyboard Navigation Shortcuts */}
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
          <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
              ↑
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
              ↓
            </kbd>{" "}
            Rows ·{" "}
            <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
              ←
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
              →
            </kbd>{" "}
            Cols ·{" "}
            <kbd className="px-1.5 py-0.5 bg-[#0b111e] border border-slate-800 rounded text-[10px] text-slate-300 font-mono">
              Enter
            </kbd>{" "}
            Details
          </p>
        </div>
      </div>

      {/* Rechte Seite: Limit Count Pill & Action Button */}
      <div className="flex items-center gap-3 self-start md:self-center shrink-0">
        <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-4 py-2 rounded-xl text-xs">
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
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            isLimitReached
              ? "bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95"
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
  );
};
