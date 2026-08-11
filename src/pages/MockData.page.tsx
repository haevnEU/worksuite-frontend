import React from "react";
import { AlertCircle, Database } from "lucide-react";
import {
  MockDataTable,
  MockDetailDrawer,
  MockGeneratorHeader,
} from "../components/mock";
import { useMockGeneratorState } from "../hooks/useMockGenerator.ts";

export const MockDataPage: React.FC = () => {
  const state = useMockGeneratorState();

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-200">
      {/* Header with Type Selector and Actions */}
      <MockGeneratorHeader
        types={state.types}
        selectedType={state.selectedType}
        amount={state.amount}
        isLoadingTypes={state.isLoadingTypes}
        isGenerating={state.isGenerating}
        hasGeneratedData={!!state.generatedData}
        fileName={state.generatedData?.fileName}
        onTypeChange={state.setSelectedType}
        onAmountChange={state.setAmount}
        onGenerate={state.handleGenerate}
        onDownload={state.handleDownload}
      />

      {/* Error Notice */}
      {state.error && (
        <div className="flex items-center gap-3 bg-rose-950/40 border border-rose-800/60 text-rose-300 px-4 py-3 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {state.isGenerating && (
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs font-semibold backdrop-blur shadow-lg">
          Generating {state.amount} mock records for type "{state.selectedType}
          "...
        </div>
      )}

      {/* Empty State */}
      {!state.isGenerating && !state.generatedData && (
        <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-12 bg-[#10192c]/80 text-center space-y-4 transition-colors backdrop-blur shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-200">
              No mock data generated
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Select a mock dataset type and amount above, then click{" "}
              <strong>Generate CSV</strong> to preview and download records.
            </p>
          </div>
        </div>
      )}

      {/* CSV Data Table */}
      {!state.isGenerating && state.generatedData && (
        <MockDataTable
          data={state.generatedData}
          paginatedRows={state.paginatedRows}
          filteredRowsCount={state.filteredRows.length}
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          pageSize={state.pageSize}
          searchTerm={state.searchTerm}
          highlightedRowIndex={state.highlightedRowIndex}
          drawerRowIndex={state.drawerRowIndex}
          onSearchChange={state.setSearchTerm}
          onPageSizeChange={state.setPageSize}
          onPageChange={state.setCurrentPage}
          onRowClick={state.handleRowClick}
        />
      )}

      {/* Detail Drawer */}
      {state.drawerRow &&
        state.drawerRowIndex !== null &&
        state.generatedData && (
          <MockDetailDrawer
            drawerRow={state.drawerRow}
            drawerRowIndex={state.drawerRowIndex}
            totalRows={state.filteredRows.length}
            headers={state.generatedData.headers}
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

export default MockDataPage;
