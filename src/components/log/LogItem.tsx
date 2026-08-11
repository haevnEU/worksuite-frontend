import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Info,
} from "lucide-react";
import { LogType } from "../../types/log.types.ts";
import { LogEntry } from "../../models/log.model.ts";

interface LogItemProps {
  log: LogEntry;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

export const LogItem: React.FC<LogItemProps> = ({ log, copiedId, onCopy }) => {
  const getLevelBadge = (level: LogType) => {
    switch (level) {
      case "error":
        return (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        );
      case "warn":
        return (
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        );
      case "info":
        return <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
      default:
        return (
          <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        );
    }
  };

  const formatTimestamp = (timestamp: Date | string | number) => {
    try {
      return new Date(timestamp).toLocaleTimeString();
    } catch {
      return String(timestamp);
    }
  };

  return (
    <div
      className={`group relative flex items-start space-x-3 p-3 rounded-xl border transition-colors ${
        log.type === "error"
          ? "bg-rose-950/20 border-rose-900/40 text-rose-200"
          : log.type === "warn"
            ? "bg-amber-950/20 border-amber-900/40 text-amber-200"
            : log.type === "info"
              ? "bg-blue-950/20 border-blue-900/40 text-blue-200"
              : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900"
      }`}
    >
      {getLevelBadge(log.type)}

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-sans">
          <span className="font-extrabold uppercase tracking-wider">
            [{log.type}]
          </span>
          <span>·</span>
          <span>{formatTimestamp(log.timestamp)}</span>
        </div>

        <pre className="whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed">
          {log.message}
        </pre>
      </div>

      <button
        type="button"
        onClick={() => onCopy(log.message, log.id)}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-opacity cursor-pointer shrink-0"
        title="Copy log entry"
      >
        {copiedId === log.id ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};
