import React from "react";
import { FileTerminal } from "lucide-react";
import { LogDetailDrawer, LogHeaderSection, LogTable } from "../components/log";
import { useLogViewerState } from "../hooks/useLogViewer.ts";

export const LogViewerPage: React.FC = () => {
  const state = useLogViewerState();

  return (
    <div className="relative space-y-6 pb-12 font-sans">
      <LogHeaderSection
        filesCount={state.files.length}
        maxFiles={state.MAX_FILES}
        onFilesSelect={state.handleFilesSelect}
      />

      {state.isLoading && (
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs font-semibold backdrop-blur shadow-lg">
          Parsing and indexing log entries...
        </div>
      )}

      {!state.isLoading && state.files.length === 0 && (
        <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-12 bg-[#10192c]/80 text-center space-y-4 transition-colors backdrop-blur shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
            <FileTerminal className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-200">
              No log files loaded
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Select or drop up to 5 log files (.log, .txt, .out) at once to
              inspect, filter, and analyze system logs.
            </p>
          </div>
        </div>
      )}

      {!state.isLoading && state.files.length > 0 && state.activeFileId && (
        <LogTable
          files={state.files}
          activeFileId={state.activeFileId}
          paginatedEntries={state.paginatedEntries}
          filteredEntriesCount={state.filteredEntries.length}
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          pageSize={state.pageSize}
          searchTerm={state.searchTerm}
          selectedLevel={state.selectedLevel}
          highlightedRowIndex={state.highlightedRowIndex}
          drawerRowIndex={state.drawerRowIndex}
          onSelectFile={state.setActiveFileId}
          onCloseFile={state.handleCloseFile}
          onSearchChange={state.setSearchTerm}
          onLevelChange={state.setSelectedLevel}
          onPageSizeChange={state.setPageSize}
          onPageChange={state.setCurrentPage}
          onRowClick={state.handleRowClick}
        />
      )}

      {state.drawerEntry && state.drawerRowIndex !== null && (
        <LogDetailDrawer
          entry={state.drawerEntry}
          drawerRowIndex={state.drawerRowIndex}
          totalRows={state.filteredEntries.length}
          onClose={() => state.setDrawerRowIndex(null)}
          onNavigate={(dir) =>
            state.setDrawerRowIndex((prev) =>
              prev !== null
                ? dir === "up"
                  ? Math.max(prev - 1, 0)
                  : Math.min(prev + 1, state.filteredEntries.length - 1)
                : null,
            )
          }
        />
      )}
    </div>
  );
};

export default LogViewerPage;
