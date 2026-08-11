import React from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  Hash,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { TimeDTO } from "../../models/timeEntry.model.ts";
import { downloadString } from "../../utils/file.util.ts";
import { useInfo } from "../../context/InfoContext.tsx";

interface TimeFilterBarProps {
  ticketIdFilter: string;
  onTicketIdChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  activityFilter: string;
  onActivityChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  filteredEntries: TimeDTO[];
}

export const TimeFilterBar: React.FC<TimeFilterBarProps> = ({
  ticketIdFilter,
  onTicketIdChange,
  dateFilter,
  onDateChange,
  activityFilter,
  onActivityChange,
  searchQuery,
  onSearchChange,
  onReset,
  filteredEntries,
}) => {
  const { redmineActivity } = useInfo();

  const hasActiveFilters =
    ticketIdFilter || dateFilter || searchQuery || activityFilter !== "all";

  const handleExportCsv = () => {
    if (filteredEntries.length === 0) return;
    const headers = [
      "Ticket ID",
      "Date",
      "Hours",
      "Minutes",
      "Activity",
      "Description",
      "Created At",
    ];

    const csvRows = filteredEntries.map((entry) => {
      const formattedDate = new Date(entry.date).toISOString().split("T")[0];
      const activityName =
        redmineActivity.find((a) => a.id === entry.activityId)?.name ||
        `Activity #${entry.activityId}`;

      const cleanDescription = (entry.description || "")
        .replace(/"/g, '""')
        .replace(/\n/g, " ");

      const createdAtFormatted = new Date(entry.createdAt).toISOString();

      return [
        entry.ticketId,
        formattedDate,
        entry.hours,
        entry.minutes,
        `"${activityName}"`,
        `"${cleanDescription}"`,
        createdAtFormatted,
      ].join(";");
    });

    const csvContent = [headers.join(";"), ...csvRows].join("\n");
    const today = new Date().toISOString().split("T")[0];
    const filename = `time_entries_export_${today}.csv`;
    downloadString(csvContent, filename, "text/csv;charset=utf-8;");
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shrink-0 shadow-lg">
      {/* 1. Zeile: Search Bar (Full Width) */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
        <input
          type="text"
          placeholder="Search description, ticket content..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-[38px] appearance-none bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Zeile: 3-spaltiges Filter-Grid mit strikter Breitenbeschränkung für WebKit/iPad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        {/* Ticket ID Filter */}
        <div className="relative min-w-0 w-full">
          <Hash className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Filter by Ticket ID..."
            value={ticketIdFilter}
            onChange={(e) => onTicketIdChange(e.target.value)}
            className="w-full h-[38px] appearance-none box-border bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
          />
        </div>

        {/* Date Filter (iPad/WebKit Safe) */}
        <div className="relative min-w-0 w-full">
          <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full h-[38px] appearance-none box-border bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors font-mono [color-scheme:dark] block"
          />
        </div>

        {/* Activity Filter (Custom Chevron für sauberes Rendering unter iOS) */}
        <div className="relative min-w-0 w-full">
          <select
            value={activityFilter}
            onChange={(e) => onActivityChange(e.target.value)}
            className="w-full h-[38px] appearance-none box-border bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-8 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer truncate"
          >
            <option value="all">All Activities</option>
            {redmineActivity.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* 3. Zeile: Action Buttons Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
        <span className="text-[11px] text-slate-500">
          Exporting {filteredEntries.length} entries
        </span>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredEntries.length === 0}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors cursor-pointer text-[11px] shadow-sm"
            title="Export filtered table as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
