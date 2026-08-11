import React, { useState } from "react";
import {
  Download,
  Plus,
  RotateCcw,
  Trash2,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { RetroResource } from "../../models/retroResource.model.ts";

interface RetroHeaderProps {
  retros: RetroResource[];
  selectedRetro: RetroResource | null;
  onSelectSprint: (sprintName: string) => void;
  onExportSprint: () => void;
  onDeleteSprint: () => void;
  newSprintName: string;
  onNewSprintNameChange: (value: string) => void;
  onCreateSprint: (e: React.FormEvent) => void;
}

export const RetroHeader: React.FC<RetroHeaderProps> = ({
  retros,
  selectedRetro,
  onSelectSprint,
  onExportSprint,
  onDeleteSprint,
  newSprintName,
  onNewSprintNameChange,
  onCreateSprint,
}) => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      {/* Top Row: Icon, Title, Badge & Guide Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Sprint Retrospective
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Team Review
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gather feedback on what went well, what needs improvement, and new
              action items.
            </p>
          </div>
        </div>

        {/* Guide Toggle */}
        <button
          type="button"
          onClick={() => setShowGuide((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer self-start md:self-center shrink-0 ${
            showGuide
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
              : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          title="Toggle retrospective guide"
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

      {/* Collapsible Action & Column Guide */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Retrospective Workflow & Categories Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Positive */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-emerald-900/40 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>🟢 What Went Well</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Celebrate sprint milestones, seamless feature deliveries,
                  resolved technical debts, and good teamwork.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>Category: positive</span>
              </div>
            </div>

            {/* 2. Negative */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-rose-900/40 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>🔴 Needs Improvement</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Address roadblocks, unexpected merge conflicts, QA testing
                  delays, or unclear issue specifications.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-rose-300 border-t border-slate-800/40">
                <span>Category: negative</span>
              </div>
            </div>

            {/* 3. Action Items */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-blue-900/40 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                  <span>💡 Ideas & Action Items</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Formulate concrete process improvements, architectural
                  initiatives, or follow-ups for next sprint.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Category: actionItems</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Toolbar: Count, Sprint Switcher, Actions & Create Sprint */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Total Retros Count Pill */}
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-3.5 py-1.5 rounded-xl">
            <span className="text-slate-400 font-medium">Retros:</span>
            <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[11px]">
              {retros.length}
            </span>
          </div>

          {/* Sprint Selector */}
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 p-1 rounded-xl">
            <span className="text-slate-400 font-semibold text-[11px] pl-2">
              Sprint:
            </span>
            <select
              value={selectedRetro?.sprintName || ""}
              onChange={(e) => onSelectSprint(e.target.value)}
              className="bg-transparent text-white font-semibold text-xs pr-2 py-1 outline-none cursor-pointer border-none"
            >
              {retros.map((retro) => (
                <option
                  key={retro.id || retro.sprintName}
                  value={retro.sprintName}
                  className="bg-[#0b111e] text-white"
                >
                  {retro.sprintName}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Retro Actions */}
          {selectedRetro && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onExportSprint}
                title="Export sprint as JSON"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
              <button
                type="button"
                onClick={onDeleteSprint}
                title="Delete active sprint"
                className="p-1.5 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 transition shadow-sm cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Create Sprint Form */}
        <form
          onSubmit={onCreateSprint}
          className="flex items-center gap-1.5 bg-[#0b111e] border border-slate-800 p-1 rounded-xl"
        >
          <input
            type="text"
            value={newSprintName}
            onChange={(e) => onNewSprintNameChange(e.target.value)}
            placeholder="New sprint..."
            className="bg-transparent pl-2.5 pr-2 py-1 text-slate-200 placeholder-slate-500 outline-none text-xs w-28 sm:w-36 font-mono"
          />
          <button
            type="submit"
            disabled={!newSprintName.trim()}
            title="Create sprint"
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white p-1.5 rounded-lg transition shadow-md shadow-blue-600/20 cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
