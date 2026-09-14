import React from "react";
import { AlertTriangle } from "lucide-react";
import type { ExceptionNode } from "../models/stacktrace.model";
import { CopyButton } from "../../../shared/components/CopyButton.tsx";

interface RootCauseBannerProps {
  rootCause: ExceptionNode;
  depth: number;
  rawText: string;
  onClear: () => void;
}

export const RootCauseBanner: React.FC<RootCauseBannerProps> = ({
  rootCause,
  depth,
  rawText,
  onClear,
}) => {
  return (
    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 shadow-lg backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
              Root Cause Identified
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono">
              {depth > 1
                ? `Depth: ${depth} Caused-by chains`
                : "Single Exception"}
            </span>
          </div>
          <h2 className="text-sm font-bold text-white font-mono break-all">
            {rootCause.exceptionClass}
          </h2>
          {rootCause.message && (
            <p className="text-xs text-rose-200/90 font-mono mt-1 break-words">
              {rootCause.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 self-start md:self-center shrink-0">
        <CopyButton
          textToCopy={rawText}
          title="Copy Raw Stacktrace"
          className="px-3 py-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        />
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
