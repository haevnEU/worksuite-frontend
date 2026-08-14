import React from "react";
import { Clock, RefreshCw } from "lucide-react";

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
  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg">
      {/* Linke Seite: Icon, Titel, Badge & Subtitel */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
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
            Tracked hours across all tickets and activities
          </p>
        </div>
      </div>

      {/* Rechte Seite: Actions & Total Pill */}
      <div className="flex items-center gap-3 self-start md:self-center">
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 bg-[#0b111e] hover:bg-slate-800 active:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          title="Refresh entries"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-400" : ""}`}
          />
        </button>

        {/* Total Tracked Pill */}
        <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <span className="text-slate-400 font-medium">Total:</span>
          <span className="bg-blue-600 text-white font-mono font-bold px-2 py-0.5 rounded-full text-[11px]">
            {totalHours}h {totalMinutes}m
          </span>
        </div>
      </div>
    </div>
  );
};
