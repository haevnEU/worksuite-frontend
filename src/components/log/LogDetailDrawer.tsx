import React, { useEffect } from "react";
import { Check, ChevronDown, ChevronUp, Copy, Info, X } from "lucide-react";
import { LogEntry } from "../../models/logViewer.model.ts";

interface LogDetailDrawerProps {
  entry: LogEntry;
  drawerRowIndex: number;
  totalRows: number;
  onClose: () => void;
  onNavigate: (direction: "up" | "down") => void;
}

export const LogDetailDrawer: React.FC<LogDetailDrawerProps> = ({
  entry,
  drawerRowIndex,
  totalRows,
  onClose,
  onNavigate,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowUp") onNavigate("up");
      if (e.key === "ArrowDown") onNavigate("down");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#10192c] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-slate-200">
        <div className="p-5 border-b border-slate-800 bg-[#0b111e]/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  Line #{entry.lineNumber}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Entry {drawerRowIndex + 1} of {totalRows}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onNavigate("up")}
                disabled={drawerRowIndex === 0}
                className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition cursor-pointer"
                title="Previous Line (Up Arrow)"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("down")}
                disabled={drawerRowIndex === totalRows - 1}
                className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition cursor-pointer"
                title="Next Line (Down Arrow)"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-800 mx-1" />

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Close (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] bg-[#10192c] px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <div className="flex items-center space-x-2">
              <span>Shortcuts:</span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-blue-400 font-mono">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-blue-400 font-mono">
                ↓
              </kbd>
              <span>· ESC Close</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-sans cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied" : "Copy Raw"}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-800">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                Level
              </span>
              <div className="p-2.5 rounded-lg border border-slate-800 bg-[#0b111e] text-slate-200">
                {entry.level}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                Timestamp
              </span>
              <div className="p-2.5 rounded-lg border border-slate-800 bg-[#0b111e] text-slate-200">
                {entry.timestamp || "N/A"}
              </div>
            </div>
          </div>

          {entry.logger && (
            <div className="space-y-1">
              <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                Logger / Class
              </span>
              <div className="p-2.5 rounded-lg border border-slate-800 bg-[#0b111e] text-slate-200 select-all">
                {entry.logger}
              </div>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
              Full Payload / Multiline Details
            </span>
            <pre className="p-4 rounded-xl border border-slate-800 bg-[#0b111e] text-slate-200 whitespace-pre-wrap break-all leading-relaxed max-h-[440px] overflow-y-auto select-all">
              {entry.rawText}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
