import React from "react";
import { Eye, HelpCircle, MessageSquare, Sparkles, Undo2 } from "lucide-react";

export const TicketHandoverHelpTab: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Ticket Handover Guidelines
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Conventions for standardizing Redmine ticket comment handoffs.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="p-3.5 bg-[#0b111e] border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <Eye className="w-4 h-4" />
            <span>Dev &rarr; Reviewer (To Review)</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-6">
            Keep it short. Ping the colleague directly and ensure the Merge
            Request URL or branch reference is explicitly clear.
          </p>
        </div>

        <div className="p-3.5 bg-[#0b111e] border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Undo2 className="w-4 h-4" />
            <span>Reviewer &rarr; Dev (Back to Dev / Feedback)</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-6">
            Categorize findings into non-critical hints vs. critical blockers.
            Clearly state whether approval is granted or if a re-review is
            needed.
          </p>
        </div>

        <div className="p-3.5 bg-[#0b111e] border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Dev / Reviewer &rarr; QA (To QA)</span>
          </div>
          <p className="text-slate-400 leading-relaxed pl-6">
            Provide the QA team with the deployed environment and version tag.
            Reiterate that the acceptance criteria from the ticket description
            apply.
          </p>
        </div>
      </div>
    </div>
  );
};
