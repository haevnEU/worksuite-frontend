import React, { useState } from "react";
import {
  Layers,
  Plus,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Monitor,
  Presentation,
  KeyRound,
  ExternalLink,
} from "lucide-react";

interface ReviewHeaderProps {
  totalCount?: number;
  onAddNewReview: () => void;
}

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  totalCount,
  onAddNewReview,
}) => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 backdrop-blur shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Sprint & Feature Reviews
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Protocols
              </span>
              {totalCount !== undefined && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {totalCount} Total
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage live demo scripts, presentation slide keyfacts, and ticket
              protocols.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showGuide
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            title="Toggle review workflow guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
            {showGuide ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onAddNewReview}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Review</span>
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Review Formats & Presentation Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-indigo-900/40 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                  <Monitor className="w-3.5 h-3.5 shrink-0" />
                  <span>Live Demo Mode</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Store step-by-step user journeys, mock credentials, and
                  validation checklists for live system walkthroughs.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-indigo-300 border-t border-slate-800/40">
                <span>Click Card → Edit & Inspect Notes</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-purple-900/40 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                  <Presentation className="w-3.5 h-3.5 shrink-0" />
                  <span>Presentation Slides</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Break down deliverables into keyfacts. Launches a presenter
                  console with popup projector and keyboard controls.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-purple-300 border-t border-slate-800/40">
                <span>Click Card → Presenter View (Popup)</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>Tracking & Archiving</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Deep-link tickets directly to Redmine. Archive presented items
                  to keep active sprint review views clean.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Direct Ticket Links · Non-destructive Archive</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
