import React from "react";
import { Download, Plus, RotateCcw, Trash2 } from "lucide-react";
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
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm font-sans">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
          <RotateCcw className="w-4 h-4" />
          <span>Continuous Team Improvement</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Sprint Retrospective</h1>
        <p className="text-slate-400 text-sm">
          Gather feedback on what went well, what needs improvement, and new
          action items.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Active Sprint:</span>
          <select
            value={selectedRetro?.sprintName || ""}
            onChange={(e) => onSelectSprint(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {retros.map((retro) => (
              <option
                key={retro.id || retro.sprintName}
                value={retro.sprintName}
              >
                {retro.sprintName}
              </option>
            ))}
          </select>
        </div>

        {selectedRetro && (
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={onExportSprint}
              title="Export Sprint as JSON"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <button
              type="button"
              onClick={onDeleteSprint}
              title="Delete Active Sprint"
              className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors cursor-pointer flex items-center justify-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <form onSubmit={onCreateSprint} className="flex items-center gap-1.5">
          <input
            type="text"
            value={newSprintName}
            onChange={(e) => onNewSprintNameChange(e.target.value)}
            placeholder="New sprint name..."
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 sm:w-40"
          />
          <button
            type="submit"
            title="Create Sprint"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
