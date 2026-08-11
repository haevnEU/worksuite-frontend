import React from "react";
import { RotateCcw, Search } from "lucide-react";
import { TicketStatus } from "../../types/ticket.type.ts";
import { RedmineStatus } from "../../models/ticketModel.model.ts";

interface ProjectOption {
  id: number;
  name: string;
}

interface TicketFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  projectIdFilter: number | "all";
  onProjectChange: (value: number | "all") => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  projects: ProjectOption[];
  statusList: RedmineStatus[];
  onReset: () => void;
}

export const TicketFilterBar: React.FC<TicketFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  projectIdFilter,
  onProjectChange,
  statusFilter,
  onStatusChange,
  projects,
  statusList,
  onReset,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 shadow-sm shrink-0 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tickets (ID, Subject, Author...)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-sans"
            />
          </div>

          <select
            value={projectIdFilter}
            onChange={(e) =>
              onProjectChange(
                e.target.value === "all" ? "all" : Number(e.target.value),
              )
            }
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {statusList && statusList.length > 0 ? (
              statusList.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))
            ) : (
              <>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Feedback">Feedback</option>
                <option value="Closed">Closed</option>
              </>
            )}
          </select>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
