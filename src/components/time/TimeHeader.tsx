import React, { useState } from "react";
import {
  Clock,
  RefreshCw,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Hash,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";

interface TimeHeaderProps {
  totalHours: number;
  totalMinutes: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export const TimeHeader: React.FC<TimeHeaderProps> = ({
  totalHours,
  totalMinutes,
  isLoading,
  onRefresh,
}) => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      {/* Top Row: Icon, Title, Badge & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Time Tracking Overview
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Live Times
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tracked hours across all tickets, activities, and daily
              development tasks.
            </p>
          </div>
        </div>

        {/* Right Side: Total Pill, Refresh & Guide Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Total:</span>
            <span className="bg-blue-600 text-white font-mono font-bold px-2 py-0.5 rounded-full text-[11px]">
              {totalHours}h {totalMinutes}m
            </span>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 bg-[#0b111e] hover:bg-slate-800 active:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            title="Refresh entries"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-400" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showGuide
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            title="Toggle time tracking guide"
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

      {/* Collapsible Guide Section */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Time Tracking & Filtering Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Filtering & Search */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span>Ticket & Text Search</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Search through descriptions or filter by exact Redmine Ticket
                  IDs to inspect allocated hours.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Filter: #1042 · Keyword search</span>
              </div>
            </div>

            {/* 2. Date & Activity Categories */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Date & Activity Types</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Narrow down entries by logging date and Redmine activity
                  categories (Development, Review, QA, Concept).
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-cyan-300 border-t border-slate-800/40">
                <span>Activities: Redmine synchronized</span>
              </div>
            </div>

            {/* 3. CSV Export */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                  <span>CSV Export</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Export currently filtered time records to a
                  semicolon-separated CSV spreadsheet ready for billing and
                  audits.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>Direct CSV download</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
