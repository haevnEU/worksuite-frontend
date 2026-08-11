import React, { useState } from "react";
import {
  FileCode,
  Plus,
  Search,
  X,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  Copy,
  Layers,
} from "lucide-react";
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
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="space-y-4 mb-6">
      {/* 1. Header Card with Top Row */}
      <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 backdrop-blur shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
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
                tickets & CI/CD.
              </p>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-4 py-2 rounded-xl text-xs">
              <span className="text-slate-400 font-medium">Templates:</span>
              <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[11px]">
                {totalTemplatesCount}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                showGuide
                  ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                  : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
              title="Toggle template guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guide</span>
              {showGuide ? (
                <ChevronUp className="w-3 h-3 ml-0.5" />
              ) : (
                <ChevronDown className="w-3 h-3 ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create new template</span>
            </button>
          </div>
        </div>

        {/* Collapsible Guide Section */}
        {showGuide && (
          <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>Template Engine & Variables Guide</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* 1. Variables & Markdown */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                    <span>Placeholders & Dynamic Tags</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Embed dynamic placeholders like{" "}
                    <code className="text-blue-300 font-mono">
                      &#123;DATE&#125;
                    </code>{" "}
                    and{" "}
                    <code className="text-blue-300 font-mono">
                      &#123;USER&#125;
                    </code>{" "}
                    into your markdown templates.
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                  <span>Replaced on copy/paste</span>
                </div>
              </div>

              {/* 2. Platform Scopes */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span>Target Platforms</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Organize snippets specifically for GitLab Merge Requests,
                    Redmine Tickets, Release Notes, or CI/CD configurations.
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-purple-300 border-t border-slate-800/40">
                  <span>Scope: GitLab · Redmine · CI/CD</span>
                </div>
              </div>

              {/* 3. Export & Tagging */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                    <Tag className="w-3.5 h-3.5 shrink-0" />
                    <span>Export & Categories</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tag templates for instant categorization. Export schemas
                    directly as clean{" "}
                    <code className="text-emerald-300 font-mono">.txt</code> or{" "}
                    <code className="text-emerald-300 font-mono">.json</code>{" "}
                    definitions.
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                  <span>Exports: .txt / .json</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Search Bar */}
      <div className="flex items-center gap-3 bg-[#10192c]/80 border border-slate-800 p-2.5 rounded-xl w-full backdrop-blur shadow-sm">
        <div className="flex items-center gap-2 px-3 flex-1">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search templates (title, content, tags)..."
            className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full font-sans"
          />
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded-lg transition cursor-pointer flex items-center gap-1 shrink-0"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* 3. Filter Pills Groups */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {/* Platform Filters */}
        <div className="flex items-center space-x-1.5 bg-[#10192c]/80 p-1.5 rounded-xl border border-slate-800">
          <span className="text-slate-500 text-[11px] font-semibold px-2 uppercase tracking-wider">
            Platform:
          </span>
          {["all", ...TEMPLATE_PLATFORMS].map((platform) => (
            <button
              key={platform}
              type="button"
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
              type="button"
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
  );
};
