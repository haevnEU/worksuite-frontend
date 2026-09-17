import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FilePlus2,
  GitPullRequest,
  HelpCircle,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import { CopyButton } from "../../../shared/components/CopyButton";

interface MrCreatorHeaderProps {
  generatedMarkdown: string;
}

export const MrCreatorHeader: React.FC<MrCreatorHeaderProps> = ({
  generatedMarkdown,
}) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner shrink-0">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-white tracking-wide">
                MR Description Generator
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Hausheld Standard Template
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Create structured, reviewer-friendly Merge Request descriptions
              including verification steps & deployment instructions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <CopyButton
            textToCopy={generatedMarkdown}
            title="Copy Markdown to clipboard"
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/20"
          />
          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer shrink-0 ${
              showGuide
                ? "bg-purple-600/20 border-purple-500/40 text-purple-300"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            title="Toggle Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
            {showGuide ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="mt-1 p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800/90 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Best Practices for Clear MRs</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <FilePlus2 className="w-3.5 h-3.5" />
                <span>Clear Motivation</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Briefly describe the problem and the chosen solution. A reviewer
                should grasp the context in under a minute.
              </p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Guide Reviewers</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Provide clear manual test steps and reference test files
                attached to the ticket so changes can be reproduced immediately.
              </p>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>Deploy & DB Risks</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Always document new Flyway migrations, configuration keys, or
                required deployment orders explicitly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
