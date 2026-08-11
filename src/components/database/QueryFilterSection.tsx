import React from "react";
import { RefreshCw, Search } from "lucide-react";
import { SearchableSelect } from "./SearchableSelect.tsx";

interface QueryFilterSectionProps {
  tables: string[];
  selectedTable: string;
  onSelectTable: (table: string) => void;
  searchParamMode: string;
  onSearchParamModeChange: (mode: string) => void;
  entityId: string;
  onEntityIdChange: (id: string) => void;
  loading: boolean;
  onExecuteQuery: () => void;
}

export const QueryFilterSection: React.FC<QueryFilterSectionProps> = ({
  tables,
  selectedTable,
  onSelectTable,
  searchParamMode,
  onSearchParamModeChange,
  entityId,
  onEntityIdChange,
  loading,
  onExecuteQuery,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Table
          </label>
          <SearchableSelect
            tables={tables}
            selectedTable={selectedTable}
            onSelect={onSelectTable}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Search Field (searchParam)
          </label>
          <select
            value={searchParamMode}
            onChange={(e) => onSearchParamModeChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="id">id</option>
            <option value="key">key</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Search Value (value)
          </label>
          <input
            type="text"
            value={entityId}
            onChange={(e) => onEntityIdChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onExecuteQuery();
            }}
            placeholder={searchParamMode === "key" ? "e.g. ABC" : "e.g. 123"}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={onExecuteQuery}
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Querying Backend...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Execute Query</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
