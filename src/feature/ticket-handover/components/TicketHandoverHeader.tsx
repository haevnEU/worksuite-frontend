import React, { useState } from "react";
import {
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  HelpCircle,
  Info,
  Sparkles,
  Undo2,
} from "lucide-react";
import { CopyButton } from "../../../shared/components/CopyButton";

interface TicketHandoverHeaderProps {
  generatedTextile: string;
}

export const TicketHandoverHeader: React.FC<TicketHandoverHeaderProps> = ({
  generatedTextile,
}) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-white tracking-wide">
                Ticket Handover Wizard
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Redmine Lifecycle Comments
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Quick and concise transition templates for ticket handovers
              between Dev, Reviewer, and QA.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <CopyButton
            textToCopy={generatedTextile}
            title="Copy Textile to clipboard"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
          />
          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              showGuide
                ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            title="Toggle Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
            {showGuide ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="mt-1 p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800/90 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Handover Stages & Best Practices</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Eye className="w-3.5 h-3.5" />
                <span>To Review</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Direct ping to the assigned reviewer with optional direct links
                to the GitLab MR for rapid context switching.
              </p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Undo2 className="w-3.5 h-3.5" />
                <span>Back to Dev</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Concise feedback containing hint counters, critical blocker
                alerts, CI status, and approval verdicts.
              </p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>To QA</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Deployment and verification handoff detailing target
                environment, deployed versions, and testing notes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
