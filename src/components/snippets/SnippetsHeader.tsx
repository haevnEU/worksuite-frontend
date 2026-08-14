import React from "react";
import { Code2, Plus, Search, X } from "lucide-react";

interface SnippetsHeaderProps {
  searchQuery: string;
  totalSnippets?: number;
  onSearchChange: (value: string) => void;
  onOpenCreateModal: () => void;
}

export const SnippetsHeader: React.FC<SnippetsHeaderProps> = ({
  searchQuery,
  totalSnippets,
  onSearchChange,
  onOpenCreateModal,
}) => {
  return (
    <div className="space-y-6 mb-6">
      {/* 1. Header Card im WorkTool Style */}
      <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Code & Snippets
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Snippets
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Manage reusable commands, code snippets & scripts
            </p>
          </div>
        </div>

        {/* Right Action Area (Count Pill + Create Button) */}
        <div className="flex items-center gap-3 self-start md:self-center">
          {totalSnippets !== undefined && (
            <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-4 py-2 rounded-xl text-xs">
              <span className="text-slate-400 font-medium">Snippets:</span>
              <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[11px]">
                {totalSnippets}
              </span>
            </div>
          )}

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create new snippet</span>
          </button>
        </div>
      </div>

      {/* 2. Search Bar im WorkTool Style */}
      <div className="flex items-center gap-3 bg-[#10192c]/80 border border-slate-800 p-2.5 rounded-xl">
        <div className="flex items-center gap-2 px-3 flex-1">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search snippets (Title, Code, Tags)..."
            className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded-lg transition cursor-pointer flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};
