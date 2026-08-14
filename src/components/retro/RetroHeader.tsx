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
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg">
      {/* Linke Seite: Icon, Titel, Badge & Beschreibung */}
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
            action items
          </p>
        </div>
      </div>

      {/* Rechte Seite: Controls, Total Pill & Actions */}
      <div className="flex flex-wrap items-center gap-3 self-start md:self-center text-xs">
        {/* Retros Count Pill */}
        <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-3.5 py-2 rounded-xl">
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

        {/* Selected Retro Actions (Export & Delete) */}
        {selectedRetro && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onExportSprint}
              title="Export Sprint as JSON"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={onDeleteSprint}
              title="Delete Active Sprint"
              className="p-2 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 transition shadow-sm cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

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
            className="bg-transparent pl-2.5 pr-2 py-1 text-slate-200 placeholder-slate-500 outline-none text-xs w-28 sm:w-32"
          />
          <button
            type="submit"
            title="Create Sprint"
            className="bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-lg transition-all shadow-md shadow-blue-600/20 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
