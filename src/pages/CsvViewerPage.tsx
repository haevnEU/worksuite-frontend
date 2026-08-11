import React from "react";
import { FileText } from "lucide-react";
import { CsvDetailDrawer, CsvHeaderSection, CsvTable } from "../components/csv";
import { useCsvViewerState } from "../hooks/useCsvViewer";

export const CsvViewerPage: React.FC = () => {
  const state = useCsvViewerState();

  return (
    <div className="relative space-y-6 pb-12 font-sans">
      <CsvHeaderSection
        filesCount={state.files.length}
        maxFiles={state.MAX_FILES}
        onFilesSelect={state.handleFilesSelect}
      />

      {state.isLoading && (
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs font-semibold backdrop-blur shadow-lg">
          Processing CSV files...
        </div>
      )}

      {!state.isLoading && state.files.length === 0 && (
        <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-12 bg-[#10192c]/80 text-center space-y-4 transition-colors backdrop-blur shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-200">No files loaded</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Select or drop up to 5 CSV files at once to inspect and compare
              datasets.
            </p>
          </div>
        </div>
      )}

      {!state.isLoading && state.files.length > 0 && state.activeFileId && (
        <CsvTable
          files={state.files}
          activeFileId={state.activeFileId}
          paginatedRows={state.paginatedRows}
          filteredRowsCount={state.filteredRows.length}
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          pageSize={state.pageSize}
          searchTerm={state.searchTerm}
          highlightedRowIndex={state.highlightedRowIndex}
          drawerRowIndex={state.drawerRowIndex}
          onSelectFile={state.handleSelectFile}
          onCloseFile={state.handleCloseFile}
          onSearchChange={state.setSearchTerm}
          onPageSizeChange={state.setPageSize}
          onPageChange={state.setCurrentPage}
          onRowClick={state.handleRowClick}
        />
      )}

      {state.drawerRow && state.drawerRowIndex !== null && state.activeFile && (
        <CsvDetailDrawer
          drawerRow={state.drawerRow}
          drawerRowIndex={state.drawerRowIndex}
          totalRows={state.filteredRows.length}
          headers={state.activeFile.headers}
          onClose={() => state.setDrawerRowIndex(null)}
          onNavigate={(dir) =>
            state.setDrawerRowIndex((prev) =>
              prev !== null
                ? dir === "up"
                  ? Math.max(prev - 1, 0)
                  : Math.min(prev + 1, state.filteredRows.length - 1)
                : null,
            )
          }
        />
      )}
    </div>
  );
};
