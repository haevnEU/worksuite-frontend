import React from "react";
import { Download, Terminal, Trash2 } from "lucide-react";

interface LogHeaderProps {
  onExport: () => void;
  onClear: () => void;
}

export const LogHeader: React.FC<LogHeaderProps> = ({ onExport, onClear }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-white">System Logs</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Live Console Output & Exception Monitoring
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          title="Export logs as JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 border border-slate-700 hover:border-rose-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          title="Clear Log Console"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </div>
  );
};
