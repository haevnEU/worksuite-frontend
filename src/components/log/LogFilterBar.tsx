import React from "react";
import { Search } from "lucide-react";
import { LogType } from "../../types/log.types.ts";

interface LogFilterBarProps {
  searchTerm: string;
  selectedLevel: "all" | LogType;
  onSearchChange: (value: string) => void;
  onLevelSelect: (level: "all" | LogType) => void;
}

const LOG_LEVELS: ("all" | LogType)[] = ["all", "error", "warn", "info", "log"];

export const LogFilterBar: React.FC<LogFilterBarProps> = ({
  searchTerm,
  selectedLevel,
  onSearchChange,
  onLevelSelect,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search log outputs..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        {LOG_LEVELS.map((lvl) => {
          const isActive = selectedLevel === lvl;
          return (
            <button
              key={lvl}
              type="button"
              onClick={() => onLevelSelect(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer border ${
                isActive
                  ? lvl === "error"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : lvl === "warn"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : lvl === "info"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : "bg-indigo-600 text-white border-indigo-500"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {lvl}
            </button>
          );
        })}
      </div>
    </div>
  );
};
