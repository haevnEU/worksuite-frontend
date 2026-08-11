import React, { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, FileText, Search, X } from "lucide-react";
import { ParsedCsvData } from "../../models/csvParser.model.ts";

interface CsvTableProps {
  files: ParsedCsvData[];
  activeFileId: string;
  paginatedRows: Record<string, string>[];
  filteredRowsCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  searchTerm: string;
  highlightedRowIndex: number | null;
  drawerRowIndex: number | null;
  onSelectFile: (fileId: string) => void;
  onCloseFile: (fileId: string, e: React.MouseEvent) => void;
  onSearchChange: (value: string) => void;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  onRowClick: (e: React.MouseEvent, globalIndex: number) => void;
}

export const CsvTable: React.FC<CsvTableProps> = ({
  files,
  activeFileId,
  paginatedRows,
  filteredRowsCount,
  currentPage,
  totalPages,
  pageSize,
  searchTerm,
  highlightedRowIndex,
  drawerRowIndex,
  onSelectFile,
  onCloseFile,
  onSearchChange,
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800 w-full">
            {files.map((file) => {
              const isActive = file.id === activeFileId;
              return (
                <div
                  key={file.id}
                  onClick={() => onSelectFile(file.id)}
                  className={`group flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer shrink-0 max-w-[360px] ${
                    isActive
                      ? "bg-slate-800 text-white border-slate-700 shadow-xs"
                      : "bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <FileText
                    className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500"}`}
                  />
                  <span className="font-bold truncate" title={file.fileName}>
                    {file.fileName}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => onCloseFile(file.id, e)}
                    className="p-0.5 rounded-md hover:bg-slate-700 hover:text-rose-400 text-slate-500 transition-colors shrink-0 ml-1 cursor-pointer"
                    title="Close file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 font-sans pl-1">
            <strong className="text-indigo-400 font-mono">
              {activeFile.headers.length}
            </strong>{" "}
            Columns,{" "}
            <strong className="text-indigo-400 font-mono">
              {activeFile.totalRows}
            </strong>{" "}
            Rows
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-center">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search across all columns..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {[25, 50, 100, 200].map((size) => (
              <option key={size} value={size}>
                {size} rows / page
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative overflow-x-auto overflow-y-auto max-h-[600px] border border-slate-800 rounded-xl bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-10 shadow-xs">
            <tr>
              <th className="px-3 py-2.5 font-extrabold text-slate-400 border-r border-slate-800/60 w-12 text-center sticky left-0 bg-slate-900 z-20">
                #
              </th>
              {activeFile.headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2.5 font-bold text-slate-200 border-r border-slate-800/60 whitespace-nowrap min-w-[140px] max-w-[280px] truncate"
                  title={header}
                >
                  {header || `Column ${idx + 1}`}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={activeFile.headers.length + 1}
                  className="px-4 py-8 text-center text-slate-500 font-semibold"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rowIndex) => {
                const globalRowIndex = (currentPage - 1) * pageSize + rowIndex;
                const isHighlighted = highlightedRowIndex === globalRowIndex;
                const isDrawerOpen = drawerRowIndex === globalRowIndex;
                const isSelected = isHighlighted || isDrawerOpen;

                return (
                  <tr
                    key={rowIndex}
                    ref={isSelected ? selectedRowRef : null}
                    onClick={(e) => onRowClick(e, globalRowIndex)}
                    className={`transition-colors cursor-pointer select-none group ${
                      isDrawerOpen
                        ? "bg-indigo-950/80 border-l-2 border-indigo-400"
                        : isHighlighted
                          ? "bg-indigo-950/50 border-l-2 border-indigo-500"
                          : "hover:bg-slate-800/40"
                    }`}
                  >
                    <td
                      className={`px-3 py-2 text-center font-mono text-[11px] border-r border-slate-800/60 sticky left-0 z-10 ${
                        isSelected
                          ? "bg-indigo-950 text-indigo-300 font-bold"
                          : "bg-slate-950 group-hover:bg-slate-900 text-slate-500"
                      }`}
                    >
                      {globalRowIndex + 1}
                    </td>

                    {activeFile.headers.map((header, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-2 border-r border-slate-800/40 whitespace-nowrap max-w-[280px] truncate font-mono text-[11px]"
                        title={String(row[header] ?? "")}
                      >
                        {row[header] !== undefined && row[header] !== "" ? (
                          <span
                            className={
                              isSelected
                                ? "text-slate-100 font-semibold"
                                : "text-slate-300"
                            }
                          >
                            {String(row[header])}
                          </span>
                        ) : (
                          <span className="text-slate-600 italic">null</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-400 font-semibold">
        <div>
          Showing{" "}
          <span className="text-slate-200 font-mono">
            {filteredRowsCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="text-slate-200 font-mono">
            {Math.min(currentPage * pageSize, filteredRowsCount)}
          </span>{" "}
          of{" "}
          <span className="text-slate-200 font-mono">{filteredRowsCount}</span>{" "}
          entries
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 border border-slate-700 transition-colors cursor-pointer"
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
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 border border-slate-700 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
