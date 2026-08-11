import React from "react";
import { Sparkles } from "lucide-react";

export const TeapotDetailsSection: React.FC = () => {
  return (
    <div className="w-full bg-[#0b111e]/90 border border-slate-800 rounded-xl p-4 md:p-5 mb-6 text-left shadow-inner space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Teapot Terminal Protocol
        </span>
        <span className="text-[10px] font-mono text-slate-500">
          RFC 2324 / HTCPCP
        </span>
      </div>

      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1 overflow-x-auto">
        <div className="text-slate-400">
          &gt; BREW /coffee/espresso HTTP/1.1
        </div>
        <div className="text-amber-300 font-bold">
          &lt; HTTP/1.1 418 I'm a teapot
        </div>
        <div className="text-slate-500">
          &lt; Content-Type: application/tea+earl-grey
        </div>
        <div className="text-slate-500">
          &lt; X-Teapot-Status: Steeping at 95°C
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-400">
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
          <span className="text-base">☕</span>
          <span>
            Coffee brewing: <strong>Strictly forbidden</strong>
          </span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2">
          <span className="text-base">🫖</span>
          <span>
            Tea compatibility: <strong>100% Perfect</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
