import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, FileText, Search, X } from "lucide-react";
import {
  LogEntry,
  LogLevel,
  ParsedLogFile,
} from "../../models/logViewer.model.ts";

interface LogTableProps {
  files: ParsedLogFile[];
  activeFileId: string;
  paginatedEntries: LogEntry[];
  filteredEntriesCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  searchTerm: string;
  selectedLevel: string;
  highlightedRowIndex: number | null;
  drawerRowIndex: number | null;
  onSelectFile: (fileId: string) => void;
  onCloseFile: (fileId: string, e: React.MouseEvent) => void;
  onSearchChange: (value: string) => void;
  onLevelChange: (level: string) => void;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  onRowClick: (e: React.MouseEvent, globalIndex: number) => void;
}

const getLevelBadgeClass = (level: LogLevel) => {
  switch (level) {
    case "ERROR":
    case "FATAL":
      return "bg-rose-500/20 text-rose-400 border-rose-500/30";
    case "WARN":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "INFO":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "DEBUG":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "TRACE":
      return "bg-slate-700/40 text-slate-400 border-slate-600/40";
    default:
      return "bg-slate-800 text-slate-400 border-slate-700";
  }
};

export const LogTable: React.FC<LogTableProps> = ({
  files,
  activeFileId,
  paginatedEntries,
  filteredEntriesCount,
  currentPage,
  totalPages,
  pageSize,
  searchTerm,
  selectedLevel,
  highlightedRowIndex,
  drawerRowIndex,
  onSelectFile,
  onCloseFile,
  onSearchChange,
  onLevelChange,
  onPageSizeChange,
  onPageChange,
  onRowClick,
}) => {
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null);
  const activeFile = files.find((f) => f.id === activeFileId) || files[0];
  const activeIndex =
    drawerRowIndex !== null ? drawerRowIndex : highlightedRowIndex;

  useEffect(() => {
    if (selectedRowRef.current) {
      selectedRowRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  if (!activeFile) return null;

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg backdrop-blur">
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-800/80 scrollbar-thin scrollbar-thumb-slate-800">
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shrink-0 max-w-[280px] ${
                isActive
                  ? "bg-blue-600/20 text-white border-blue-500/60 shadow-md ring-1 ring-blue-500/30"
                  : "bg-[#0b111e] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <FileText
                className={`w-3.5 h-3.5 shrink-0 ${
                  isActive ? "text-blue-400" : "text-slate-500"
                }`}
              />
              <span className="font-bold truncate" title={file.fileName}>
                {file.fileName}
              </span>
              <button
                type="button"
                onClick={(e) => onCloseFile(file.id, e)}
                className="p-0.5 rounded-md hover:bg-slate-700/80 hover:text-rose-400 text-slate-500 transition shrink-0 ml-1 cursor-pointer"
                title="Close log"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by keyword, path, logger..."
              className="w-full bg-[#0b111e] border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-sm transition"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            className="bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            <option value="ALL">All Levels</option>
            <option value="ERROR">ERROR / FATAL</option>
            <option value="WARN">WARN</option>
            <option value="INFO">INFO</option>
            <option value="DEBUG">DEBUG</option>
            <option value="TRACE">TRACE</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
            <span className="bg-[#0b111e] border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
              Total Entries:{" "}
              <strong className="text-blue-400 font-mono font-bold">
                {activeFile.totalLines}
              </strong>
            </span>

            {activeFile.levelCounts.ERROR > 0 && (
              <span className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-2.5 py-2 rounded-xl font-mono font-semibold text-[11px]">
                {activeFile.levelCounts.ERROR} Errors
              </span>
            )}

            {activeFile.levelCounts.WARN > 0 && (
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-2 rounded-xl font-mono font-semibold text-[11px]">
                {activeFile.levelCounts.WARN} Warnings
              </span>
            )}
          </div>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            {[50, 100, 250, 500].map((size) => (
              <option key={size} value={size}>
                {size} entries / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Log-Tabelle */}
      <div className="relative overflow-x-auto overflow-y-auto max-h-[600px] border border-slate-800 rounded-xl bg-[#0b111e] scrollbar-thin scrollbar-thumb-slate-800">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead className="sticky top-0 bg-[#10192c] border-b border-slate-800 z-10 shadow-xs font-sans text-slate-400">
            <tr>
              <th className="px-3 py-2.5 font-bold w-14 text-center border-r border-slate-800/60 sticky left-0 bg-[#10192c] z-20">
                #
              </th>
              <th className="px-3 py-2.5 font-bold w-44 border-r border-slate-800/60 whitespace-nowrap">
                Timestamp
              </th>
              <th className="px-3 py-2.5 font-bold w-20 border-r border-slate-800/60 text-center">
                Level
              </th>
              <th className="px-3 py-2.5 font-bold w-64 border-r border-slate-800/60 whitespace-nowrap">
                Logger / Endpoint
              </th>
              <th className="px-4 py-2.5 font-bold">Message</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/40 text-slate-300">
            {paginatedEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-slate-500 font-sans font-semibold"
                >
                  No matching log records found.
                </td>
              </tr>
            ) : (
              paginatedEntries.map((entry, rowIndex) => {
                const globalIndex = (currentPage - 1) * pageSize + rowIndex;
                const isHighlighted = highlightedRowIndex === globalIndex;
                const isDrawerOpen = drawerRowIndex === globalIndex;
                const isSelected = isHighlighted || isDrawerOpen;

                return (
                  <tr
                    key={entry.id}
                    ref={isSelected ? selectedRowRef : null}
                    onClick={(e) => onRowClick(e, globalIndex)}
                    className={`transition-colors cursor-pointer select-none group ${
                      isDrawerOpen
                        ? "bg-blue-950/80 border-l-2 border-blue-400"
                        : isHighlighted
                          ? "bg-blue-950/50 border-l-2 border-blue-500"
                          : "hover:bg-slate-800/40"
                    }`}
                  >
                    <td
                      className={`px-3 py-2 text-center text-[11px] border-r border-slate-800/60 sticky left-0 z-10 ${
                        isSelected
                          ? "bg-blue-950 text-blue-300 font-bold"
                          : "bg-[#0b111e] group-hover:bg-[#10192c] text-slate-500"
                      }`}
                    >
                      {entry.lineNumber}
                    </td>

                    <td className="px-3 py-2 border-r border-slate-800/40 whitespace-nowrap text-[11px] text-slate-400">
                      {entry.timestamp || "-"}
                    </td>

                    <td className="px-3 py-2 border-r border-slate-800/40 whitespace-nowrap text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadgeClass(
                          entry.level,
                        )}`}
                      >
                        {entry.level}
                      </span>
                    </td>

                    <td
                      className="px-3 py-2 border-r border-slate-800/40 whitespace-nowrap text-[11px] text-slate-400 truncate max-w-[240px]"
                      title={entry.logger || ""}
                    >
                      {entry.logger || "-"}
                    </td>

                    <td
                      className="px-4 py-2 text-[11px] leading-relaxed max-w-[500px] truncate"
                      title={entry.message}
                    >
                      <span
                        className={
                          isSelected
                            ? "text-white font-semibold"
                            : entry.level === "ERROR" || entry.level === "FATAL"
                              ? "text-rose-300"
                              : entry.level === "WARN"
                                ? "text-amber-300"
                                : "text-slate-300"
                        }
                      >
                        {entry.message}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-400 font-semibold font-sans">
        <div>
          Showing{" "}
          <span className="text-slate-200 font-mono">
            {filteredEntriesCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-slate-200 font-mono">
            {Math.min(currentPage * pageSize, filteredEntriesCount)}
          </span>{" "}
          of{" "}
          <span className="text-slate-200 font-mono">
            {filteredEntriesCount}
          </span>{" "}
          entries
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 font-mono text-slate-300">
            Page {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
