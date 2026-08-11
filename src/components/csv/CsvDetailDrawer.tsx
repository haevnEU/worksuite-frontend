import React from "react";
import { ChevronDown, ChevronUp, Info, X } from "lucide-react";

interface CsvDetailDrawerProps {
  drawerRow: Record<string, string>;
  drawerRowIndex: number;
  totalRows: number;
  headers: string[];
  onClose: () => void;
  onNavigate: (direction: "up" | "down") => void;
}

export const CsvDetailDrawer: React.FC<CsvDetailDrawerProps> = ({
  drawerRow,
  drawerRowIndex,
  totalRows,
  headers,
  onClose,
  onNavigate,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
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
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 border border-slate-700 transition-colors cursor-pointer"
                title="Previous Row (Up Arrow)"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("down")}
                disabled={drawerRowIndex === totalRows - 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 border border-slate-700 transition-colors cursor-pointer"
                title="Next Row (Down Arrow)"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-800 mx-1" />

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <span>Shortcuts:</span>
            <span className="flex items-center gap-1 font-mono text-slate-300 font-bold">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-indigo-400">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-indigo-400">
                ↓
              </kbd>
              <span className="font-sans font-normal text-slate-400">
                Switch rows
              </span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-slate-300 font-bold">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300">
                ESC
              </kbd>
              <span className="font-sans font-normal text-slate-400 pl-1">
                Close
              </span>
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-xs divide-y divide-slate-800/60 scrollbar-thin scrollbar-thumb-slate-800">
          {headers.map((header, idx) => {
            const value = drawerRow[header];
            const isEmpty = value === undefined || value === "";

            return (
              <div key={idx} className="pt-3 first:pt-0 space-y-1 group">
                <div className="text-[11px] font-sans font-bold text-slate-400 group-hover:text-indigo-400 transition-colors">
                  {header || `Column ${idx + 1}`}
                </div>
                <div
                  className={`p-2.5 rounded-lg border text-xs break-all select-all font-mono ${
                    isEmpty
                      ? "bg-slate-950/40 border-slate-800/50 text-slate-600 italic"
                      : "bg-slate-950 border-slate-800 text-slate-200"
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
