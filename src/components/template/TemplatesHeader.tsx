import React from "react";
import { FileCode, Plus, Search } from "lucide-react";
import {
  TEMPLATE_PLATFORMS,
  TEMPLATE_TAGS,
} from "../../constants/templateResource.constant.ts";

interface TemplatesHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  totalTemplatesCount: number;
  onOpenModal: () => void;
}

export const TemplatesHeader: React.FC<TemplatesHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
  selectedCategory,
  onCategoryChange,
  totalTemplatesCount,
  onOpenModal,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Templates
            </h1>
            <p className="text-xs text-slate-400">
              Reusable text templates for bug reports, merge requests, Redmine
              tickets & CI/CD
            </p>
          </div>
        </div>

        <button
          onClick={onOpenModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create new template</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search templates (title, content, tags)..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] px-2">Platform:</span>
            {["all", ...TEMPLATE_PLATFORMS].map((platform) => (
              <button
                key={platform}
                onClick={() => onPlatformChange(platform)}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-colors capitalize ${
                  selectedPlatform === platform
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto bg-slate-900 p-1 rounded-xl border border-slate-800">
            {["all", ...TEMPLATE_TAGS].map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors capitalize ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {category === "all"
                  ? `${category} (${totalTemplatesCount})`
                  : category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
