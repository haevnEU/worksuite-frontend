import React from "react";
import { RefreshCw, TrendingUp } from "lucide-react";
import { DaysRange } from "../../../types/kpi.type.ts";

interface KpiWidgetHeaderProps {
  selectedRange: DaysRange;
  isRefreshing: boolean;
  isDisabled: boolean;
  onRangeChange: (range: DaysRange) => void;
  onRefresh: () => void;
}

export const KpiWidgetHeader: React.FC<KpiWidgetHeaderProps> = ({
  selectedRange,
  isRefreshing,
  isDisabled,
  onRangeChange,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-extrabold text-white">
              Processed Tickets per Day
            </h2>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isDisabled}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700 disabled:opacity-50"
              title="Refresh KPI Data"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRefreshing ? "animate-spin text-indigo-400" : ""
                }`}
              />
            </button>

            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-[11px] font-bold">
              {([7, 14, 21] as DaysRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => onRangeChange(range)}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    selectedRange === range
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {range}D
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Daily overview of ticket activity and logged metrics
          </p>
        </div>
      </div>
    </div>
  );
};
