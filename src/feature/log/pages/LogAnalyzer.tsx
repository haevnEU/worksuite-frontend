import React, { useEffect, useState } from "react";
import { Clipboard, FileTerminal } from "lucide-react";

import { useLogViewer } from "../hooks/useLogViewer";
import { LogHeaderSection } from "../components/LogHeaderSection";
import { LogTable } from "../components/LogTable";
import { LogDetailDrawer } from "../components/LogDetailDrawer";
import { LogPasteModal } from "../components/LogPasteModal";
import { LogAiOverlay } from "../ai/overlay.ai.tsx";

export const LogAnalyzer: React.FC = () => {
  const state = useLogViewer();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      const pastedText = e.clipboardData?.getData("text");
      if (pastedText && pastedText.trim().length > 0) {
        e.preventDefault();
        const timestamp = new Date()
          .toISOString()
          .replace(/[:.]/g, "-")
          .slice(11, 19);
        const file = new File([pastedText], `pasted-log-${timestamp}.log`, {
          type: "text/plain",
        });
        state.handleFilesSelect([file]);
      }
    };

    window.addEventListener("paste", handleGlobalPaste);
    return () => window.removeEventListener("paste", handleGlobalPaste);
  }, [state]);

  return (
    <div className="relative space-y-6 pb-12 font-sans">
      <LogHeaderSection
        filesCount={state.files.length}
        maxFiles={state.MAX_FILES}
        onFilesSelect={state.handleFilesSelect}
        onPasteClick={() => setIsPasteModalOpen(true)}
        searchTerm={state.searchTerm}
        onSearchChange={state.setSearchTerm}
        searchMode={state.searchMode}
        onSearchModeChange={state.setSearchMode}
        selectedLogLevel={state.selectedLevel}
        onLogLevelChange={state.setSelectedLevel}
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
              Drop up to {state.MAX_FILES} log files, or paste clipboard
              contents directly with{" "}
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-blue-400 font-mono">
                Ctrl+V
              </kbd>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPasteModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <Clipboard className="w-3.5 h-3.5 text-blue-400" />
            <span>Paste Logs Now</span>
          </button>
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

      <LogPasteModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onConfirm={(file) => state.handleFilesSelect([file])}
      />

      <LogAiOverlay
        entries={state.filteredEntries}
        totalFilteredCount={state.filteredEntries.length}
      />
    </div>
  );
};

export default LogAnalyzer;
