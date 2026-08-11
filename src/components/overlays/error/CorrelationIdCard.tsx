import React from "react";
import { Check, Copy } from "lucide-react";

interface CorrelationIdCardProps {
  correlationId: string;
  copied: boolean;
  onCopy: () => void;
}

export const CorrelationIdCard: React.FC<CorrelationIdCardProps> = ({
  correlationId,
  copied,
  onCopy,
}) => {
  return (
    <div className="bg-[#0b111e] border border-slate-800 rounded-xl p-4 mb-6 shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Correlation ID (for Support)
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy ID</span>
            </>
          )}
        </button>
      </div>
      <div className="font-mono text-sm text-purple-300 select-all break-all bg-purple-950/20 p-2.5 rounded-lg border border-purple-800/30">
        {correlationId}
      </div>
    </div>
  );
};
