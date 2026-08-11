import React from "react";
import { PriorityFilter } from "../../types/PushService.type.ts";

interface NotificationPriorityTabsProps {
  activeTab: PriorityFilter;
  onTabChange: (tab: PriorityFilter) => void;
  counts: Record<PriorityFilter, number>;
}

export const NotificationPriorityTabs: React.FC<
  NotificationPriorityTabsProps
> = ({ activeTab, onTabChange, counts }) => {
  return (
    <div className="p-3 bg-slate-950 border-b border-slate-800 font-sans">
      <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
        <button
          onClick={() => onTabChange("all")}
          className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          All ({counts.all})
        </button>
        <button
          onClick={() => onTabChange("INFO")}
          className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === "INFO"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Info ({counts.INFO})
        </button>
        <button
          onClick={() => onTabChange("WARN")}
          className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === "WARN"
              ? "bg-amber-600 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Warn ({counts.WARN})
        </button>
        <button
          onClick={() => onTabChange("ERROR")}
          className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === "ERROR"
              ? "bg-rose-600 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Error ({counts.ERROR})
        </button>
        <button
          onClick={() => onTabChange("CRITICAL")}
          className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === "CRITICAL"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Critical ({counts.CRITICAL})
        </button>
      </div>
    </div>
  );
};
