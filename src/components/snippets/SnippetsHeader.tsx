import React, { useState } from "react";
import {
  Code2,
  Plus,
  Search,
  X,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Terminal,
  Tag,
  Copy,
} from "lucide-react";

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
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="space-y-4 mb-6">
      {/* 1. Header Card with Top Row & Guide */}
      <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 backdrop-blur shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
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
                Manage reusable commands, code snippets, and terminal scripts.
              </p>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
            {totalSnippets !== undefined && (
              <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-4 py-2 rounded-xl text-xs">
                <span className="text-slate-400 font-medium">Snippets:</span>
                <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[11px]">
                  {totalSnippets}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                showGuide
                  ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                  : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
              title="Toggle snippets guide"
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
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create new snippet</span>
            </button>
          </div>
        </div>

        {/* Collapsible Guide Section */}
        {showGuide && (
          <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>Code Snippets & Syntax Highlighter Guide</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* 1. Multi-language Syntax Highlighting */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                    <Terminal className="w-3.5 h-3.5 shrink-0" />
                    <span>Language Support</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Supports 20+ programming languages (Java, TypeScript,
                    Python, Bash, SQL, Dockerfile, etc.) with real-time editor
                    highlighting.
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                  <span>Prism syntax highlighting engine</span>
                </div>
              </div>

              {/* 2. Tagging & Categories */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                    <Tag className="w-3.5 h-3.5 shrink-0" />
                    <span>Tags & Categorization</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Add comma-separated tags (e.g. docker, spring, k8s) to
                    organize utilities and scripts across multiple repositories.
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-purple-300 border-t border-slate-800/40">
                  <span>Searchable by #tag identifiers</span>
                </div>
              </div>

              {/* 3. Fast Copy */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                    <span>Instant Clipboard Copy</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Copy complete scripts or code blocks directly to the
                    clipboard without line wrapping artifacts.
                  </p>
                </div>
                <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                  <span>1-Click clean raw code copy</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Search Bar */}
      <div className="flex items-center gap-3 bg-[#10192c]/80 border border-slate-800 p-2.5 rounded-xl backdrop-blur shadow-sm">
        <div className="flex items-center gap-2 px-3 flex-1">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search snippets (Title, Code, Tags)..."
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
    </div>
  );
};
