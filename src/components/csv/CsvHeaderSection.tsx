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
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border p-6 rounded-2xl shadow-sm transition-colors ${
        isDragging ? "border-indigo-500 bg-indigo-950/20" : "border-slate-800"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-white">CSV Inspector</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">
              ↑
            </kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">
              ↓
            </kbd>{" "}
            Navigate rows ·{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">
              ←
            </kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">
              →
            </kbd>{" "}
            Scroll columns ·{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">
              Enter
            </kbd>{" "}
            Open details
          </p>
        </div>
      </div>

      <label
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shrink-0 self-start sm:self-auto ${
          isLimitReached
            ? "bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed shadow-none"
            : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-indigo-600/20 active:scale-95"
        }`}
        title={
          isLimitReached
            ? `Maximum limit of ${maxFiles} files reached. Close a file to add more.`
            : "Upload up to 5 CSV files at once"
        }
      >
        {isLimitReached ? (
          <Lock className="w-4 h-4 text-slate-500" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        <span>
          {isLimitReached
            ? `Max Files Reached (${filesCount}/${maxFiles})`
            : "Add CSV Files"}
        </span>
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
  );
};
