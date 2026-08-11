import React, { useState } from "react";
import {
  Calendar,
  Download,
  RefreshCw,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  ListTodo,
  Sparkles,
} from "lucide-react";
import { WeeklyMeetingDTO } from "../../models/weeklyMeeting.model.ts";

interface TeamMeetingHeaderProps {
  activeMeeting: WeeklyMeetingDTO | null;
  isGenerating: boolean;
  isExporting: boolean;
  isLoading: boolean;
  onGenerateNextWeek: () => void;
  onExportPdf: () => void;
}

export const TeamMeetingHeader: React.FC<TeamMeetingHeaderProps> = ({
  activeMeeting,
  isGenerating,
  isExporting,
  isLoading,
  onGenerateNextWeek,
  onExportPdf,
}) => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                {activeMeeting
                  ? activeMeeting.title
                  : "Team Meeting & Tuesday Preparation"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Weekly Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tuesday-to-Tuesday sync cycles, daily work logs, task tracking,
              and PDF report exports.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showGuide
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            title="Toggle team meeting guide"
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
            disabled={isGenerating || isLoading}
            onClick={onGenerateNextWeek}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`}
            />
            <span>{isGenerating ? "Generating..." : "Generate Week"}</span>
          </button>

          <button
            type="button"
            disabled={!activeMeeting || isExporting || isLoading}
            onClick={onExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Download
              className={`w-3.5 h-3.5 text-blue-400 ${
                isExporting ? "animate-bounce" : ""
              }`}
            />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Weekly Meeting & Preparation Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Tuesday Cycle</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Reports run from Tuesday to Tuesday (excluding weekends).
                  "Generate Week" automatically initializes the workdays for the
                  upcoming sync.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Cycle: Tuesday – Tuesday (Working Days)</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <ListTodo className="w-3.5 h-3.5 shrink-0" />
                  <span>Daily Logs & Checklists</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Switch between active weekdays to log daily achievements,
                  blockers, and completed checklist tasks.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>Auto-saved per working day</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Weekly Summary & PDF</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Provide an executive summary of the week. Export a printable,
                  branded PDF report for the sync meeting.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-purple-300 border-t border-slate-800/40">
                <span>High-level summary · Print ready</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
