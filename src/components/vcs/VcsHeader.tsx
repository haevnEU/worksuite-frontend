import React, { useState } from "react";
import {
  ExternalLink,
  GitPullRequest,
  RefreshCw,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  GitMerge,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { VCS_URL } from "../../constants/url.constant.ts";

interface VcsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export const VcsHeader: React.FC<VcsHeaderProps> = ({
  onRefresh,
  isLoading,
}) => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner shrink-0">
            <GitPullRequest className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                VCS Hub
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                GitLab & Reviews
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Code reviews, active merge requests & CI/CD pipeline status
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showGuide
                ? "bg-orange-600/20 border-orange-500/40 text-orange-300"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            title="Toggle VCS guide"
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
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0b111e] hover:bg-slate-800 active:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-orange-400" : ""}`}
            />
            <span>Sync</span>
          </button>

          <a
            href={VCS_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <span>Open VCS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>VCS Hub & Review Workflow Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                  <GitMerge className="w-3.5 h-3.5 shrink-0" />
                  <span>Merge Request Feeds</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Switch between merge requests waiting for your approval (
                  <strong className="text-slate-200">To Review</strong>) and
                  your own opened PRs across all repositories,
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-indigo-300 border-t border-slate-800/40">
                <span>Tabs: To Review · My MRs</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>CI/CD Pipeline Status</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Monitors automated test suites and build pipelines for
                  main/protected branches in real time, signaling broken builds
                  immediately.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>Status: Passed · Failed · Running</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-orange-400 font-semibold mb-1">
                  <Terminal className="w-3.5 h-3.5 shrink-0" />
                  <span>1-Click Branch Checkout</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Click the branch badge on any MR card to copy the exact{" "}
                  <code className="text-orange-300">git checkout</code> command
                  directly to your clipboard.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-orange-300 border-t border-slate-800/40">
                <span>git checkout feature/branch</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
