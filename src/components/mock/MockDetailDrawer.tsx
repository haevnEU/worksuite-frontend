import React, { useEffect } from "react";
import { ChevronDown, ChevronUp, Info, X } from "lucide-react";

interface MockDetailDrawerProps {
  drawerRow: Record<string, string>;
  drawerRowIndex: number;
  totalRows: number;
  headers: string[];
  onClose: () => void;
  onNavigate: (direction: "up" | "down") => void;
}

export const MockDetailDrawer: React.FC<MockDetailDrawerProps> = ({
  drawerRow,
  drawerRowIndex,
  totalRows,
  headers,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowUp") onNavigate("up");
      if (e.key === "ArrowDown") onNavigate("down");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigate]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#10192c] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-slate-200">
        <div className="p-5 border-b border-slate-800 bg-[#0b111e]/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  Record #{drawerRowIndex + 1}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Row {drawerRowIndex + 1} of {totalRows}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onNavigate("up")}
                disabled={drawerRowIndex === 0}
                className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition cursor-pointer"
                title="Previous Row (Up Arrow)"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("down")}
                disabled={drawerRowIndex === totalRows - 1}
                className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition cursor-pointer"
                title="Next Row (Down Arrow)"
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

          <div className="flex items-center space-x-2 text-[11px] bg-[#10192c] px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <span>Shortcuts:</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-blue-400 font-mono">
              ↑
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-blue-400 font-mono">
              ↓
            </kbd>
            <span>· ESC Close</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-xs divide-y divide-slate-800/60 scrollbar-thin scrollbar-thumb-slate-800">
          {headers.map((header, idx) => {
            const value = drawerRow[header];
            const isEmpty = value === undefined || value === "";

            return (
              <div key={idx} className="pt-3 first:pt-0 space-y-1 group">
                <div className="text-[11px] font-sans font-bold text-slate-400 group-hover:text-blue-400 transition-colors">
                  {header || `Column ${idx + 1}`}
                </div>
                <div
                  className={`p-2.5 rounded-lg border text-xs break-all select-all font-mono ${
                    isEmpty
                      ? "bg-[#0b111e]/40 border-slate-800/50 text-slate-600 italic"
                      : "bg-[#0b111e] border-slate-800 text-slate-200"
                  }`}
                >
                  {isEmpty ? "null / empty" : String(value)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
