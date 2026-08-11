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
    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">
            Time Tracking Overview
          </h2>
          <p className="text-slate-400 text-[11px]">
            Tracked hours across all tickets and activities
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/60 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh entries"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-400" : ""}`}
          />
        </button>

        <div className="flex items-center space-x-2.5 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
          <span className="text-slate-400 font-semibold text-[11px]">
            Total Tracked:
          </span>
          <span className="font-mono text-xs font-bold text-blue-400">
            {totalHours}h {totalMinutes}m
          </span>
        </div>
      </div>
    </div>
  );
};
