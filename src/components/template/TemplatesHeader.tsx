import React from "react";
import { FileCode, Plus, Search, X } from "lucide-react";
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
    <div className="space-y-6 mb-6">
      {/* 1. Header Card im WorkTool Style */}
      <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Templates
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Workflows
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Reusable text templates for bug reports, merge requests, Redmine
              tickets & CI/CD
            </p>
          </div>
        </div>

        {/* Right Action Area (Count Pill + Create Button) */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Templates:</span>
            <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[11px]">
              {totalTemplatesCount}
            </span>
          </div>

          <button
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create new template</span>
          </button>
        </div>
      </div>

      {/* 2. Controls Area (Search & Filter Pills) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-[#10192c]/80 border border-slate-800 p-2.5 rounded-xl flex-1 max-w-xl">
          <div className="flex items-center gap-2 px-3 flex-1">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search templates (title, content, tags)..."
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

        {/* Filter Pills Groups */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Platform Filters */}
          <div className="flex items-center space-x-1.5 bg-[#10192c]/80 p-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[11px] font-semibold px-2 uppercase tracking-wider">
              Platform:
            </span>
            {["all", ...TEMPLATE_PLATFORMS].map((platform) => (
              <button
                key={platform}
                onClick={() => onPlatformChange(platform)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all capitalize ${
                  selectedPlatform === platform
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto bg-[#10192c]/80 p-1.5 rounded-xl border border-slate-800">
            {["all", ...TEMPLATE_TAGS].map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap cursor-pointer transition-all capitalize ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium"
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
