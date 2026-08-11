import React, { useState } from "react";
import {
  RefreshCw,
  Ticket,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  GitPullRequest,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

interface TicketHeaderProps {
  openTicketsCount: number;
  totalTicketsCount: number;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  openTicketsCount,
  totalTicketsCount,
  onRefresh,
  isLoading = false,
}) => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-sm space-y-4 shrink-0">
      {/* Top Row: Info & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                Redmine Ticket Overview
              </h1>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                Live Redmine
              </span>
              <button
                type="button"
                onClick={onRefresh}
                disabled={isLoading}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 focus:outline-none cursor-pointer transition-colors disabled:opacity-50"
                title="Refresh tickets"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-slate-400 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              All current tickets in an interactive, sortable overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          {/* Action Guide Toggle Button */}
          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              showGuide
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600"
            }`}
            title="Toggle actions & workflow guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
            {showGuide ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>

          {/* Counts */}
          <div className="flex items-center space-x-3 text-xs bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-slate-400 font-medium">Open Tickets:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow-xs">
              {openTicketsCount}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-medium">Total:</span>
            <span className="font-bold text-white">{totalTicketsCount}</span>
          </div>
        </div>
      </div>

      {/* Collapsible Action Guide Section */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Ticket Actions & Workflow Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. MR Code / MR Link */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                  <GitPullRequest className="w-3.5 h-3.5 shrink-0" />
                  <span>MR Code / MR Link</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Generates standardized branch/commit naming and opens the
                  linked VCS Merge Request directly.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-indigo-300 border-t border-slate-800/40">
                <span>Ref: !142 · feature/#1042</span>
              </div>
            </div>

            {/* 2. Move to QA */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Move to QA</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Transitions the ticket status to QA and appends the
                  standardized handoff template. The assignee must be updated
                  manually.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>Status → QA · Manual Assignee</span>
              </div>
            </div>

            {/* 3. Log Time */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Log Time</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Books spent hours into both the Redmine ticket budget and the
                  internal Worksuite time management tracker.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-amber-300 border-t border-slate-800/40">
                <span>Dual Sync: Redmine + Worksuite</span>
              </div>
            </div>

            {/* 4. Details */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>Details</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Opens the full ticket drawer containing description, custom
                  fields, journal history, subtasks, and attachments.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Full Ticket Metadata</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
