import React, { useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Search,
  X,
} from "lucide-react";
import { ParsedCsvResult } from "../../hooks/useMockGenerator.ts";

interface MockDataTableProps {
  data: ParsedCsvResult;
  paginatedRows: Record<string, string>[];
  filteredRowsCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  searchTerm: string;
  highlightedRowIndex: number | null;
  drawerRowIndex: number | null;
  onSearchChange: (value: string) => void;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
  onRowClick: (e: React.MouseEvent, globalIndex: number) => void;
}

export const MockDataTable: React.FC<MockDataTableProps> = ({
  data,
  paginatedRows,
  filteredRowsCount,
  currentPage,
  totalPages,
  pageSize,
  searchTerm,
  highlightedRowIndex,
  drawerRowIndex,
  onSearchChange,
  onPageSizeChange,
  onPageChange,
  onRowClick,
}) => {
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null);
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

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg backdrop-blur">
      {/* File Info & Search / PageSize Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter records across all columns..."
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

        {/* Right: Summary badges & Page size */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-3 py-2 rounded-xl text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span
              className="font-mono text-slate-300 font-semibold truncate max-w-[220px]"
              title={data.fileName}
            >
              {data.fileName}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">
              <strong className="text-blue-400 font-mono">
                {data.headers.length}
              </strong>{" "}
              Cols,{" "}
              <strong className="text-blue-400 font-mono">
                {data.totalRows}
              </strong>{" "}
              Rows
            </span>
          </div>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
          >
            {[25, 50, 100, 250].map((size) => (
              <option key={size} value={size}>
                {size} rows / page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CSV Table */}
      <div className="relative overflow-x-auto overflow-y-auto max-h-[600px] border border-slate-800 rounded-xl bg-[#0b111e] scrollbar-thin scrollbar-thumb-slate-800">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead className="sticky top-0 bg-[#10192c] border-b border-slate-800 z-10 shadow-xs text-slate-400">
            <tr>
              <th className="px-3 py-2.5 font-bold border-r border-slate-800/60 w-12 text-center sticky left-0 bg-[#10192c] z-20">
                #
              </th>
              {data.headers.map((header, idx) => (
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

          <tbody className="divide-y divide-slate-800/40 text-slate-300">
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={data.headers.length + 1}
                  className="px-4 py-12 text-center text-slate-500 font-semibold"
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
                        ? "bg-blue-950/80 border-l-2 border-blue-400"
                        : isHighlighted
                          ? "bg-blue-950/50 border-l-2 border-blue-500"
                          : "hover:bg-slate-800/40"
                    }`}
                  >
                    <td
                      className={`px-3 py-2 text-center font-mono text-[11px] border-r border-slate-800/60 sticky left-0 z-10 ${
                        isSelected
                          ? "bg-blue-950 text-blue-300 font-bold"
                          : "bg-[#0b111e] group-hover:bg-[#10192c] text-slate-500"
                      }`}
                    >
                      {globalRowIndex + 1}
                    </td>

                    {data.headers.map((header, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-2 border-r border-slate-800/40 whitespace-nowrap max-w-[280px] truncate font-mono text-[11px]"
                        title={String(row[header] ?? "")}
                      >
                        {row[header] !== undefined && row[header] !== "" ? (
                          <span
                            className={
                              isSelected
                                ? "text-white font-semibold"
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

      {/* Pagination Footer */}
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
          records
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
