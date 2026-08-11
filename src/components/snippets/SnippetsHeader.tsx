import React from "react";
import { Code2, Plus, Search } from "lucide-react";

interface SnippetsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenCreateModal: () => void;
}

export const SnippetsHeader: React.FC<SnippetsHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Code & Snippets
            </h1>
            <p className="text-xs text-slate-400">
              Manage reusable commands, code snippets & scripts.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            placeholder="Search snippets (Title, Code, Tags)..."
            className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-2 shrink-0 cursor-pointer"
            onClick={onOpenCreateModal}
          >
            <Plus className="w-4 h-4" />
            <span>Create new snippet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
