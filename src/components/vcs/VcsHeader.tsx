import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GitMerge,
  GitPullRequest,
  HelpCircle,
  Info,
  RefreshCw,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { VCS_URL } from "../../constants/url.constant.ts";
import { useSettings } from "../../context/SettingsContext.tsx";

interface VcsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export const VcsHeader: React.FC<VcsHeaderProps> = ({
  onRefresh,
  isLoading,
}) => {
  const { vcsProvider } = useSettings();
  const isGitLab = (vcsProvider || "GITLAB") === "GITLAB";
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const theme = {
    iconBg: isGitLab
      ? "bg-orange-600/20 border-orange-500/30 text-orange-400"
      : "bg-purple-600/20 border-purple-500/30 text-purple-400",
    badge: isGitLab
      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
      : "bg-purple-500/20 text-purple-400 border-purple-500/30",
    guideBtnActive: isGitLab
      ? "bg-orange-600/20 border-orange-500/40 text-orange-300"
      : "bg-purple-600/20 border-purple-500/40 text-purple-300",
    openBtn: isGitLab
      ? "bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 border-orange-500/30"
      : "bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border-purple-500/30",
    spinColor: isGitLab ? "text-orange-400" : "text-purple-400",
    guideHeader: isGitLab ? "text-orange-400" : "text-purple-400",
    cardIcon: isGitLab ? "text-orange-400" : "text-purple-400",
    terminalCode: isGitLab ? "text-orange-300" : "text-purple-300",
    providerLabel: isGitLab ? "GitLab & Reviews" : "GitHub & PRs",
    feedName: isGitLab ? "Merge Request Feeds" : "Pull Request Feeds",
    subSubtitle: isGitLab
      ? "Code reviews, active merge requests & CI/CD pipeline status"
      : "Code reviews, active pull requests & GitHub Actions status",
  };

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-inner shrink-0 ${theme.iconBg}`}
          >
            <GitPullRequest className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                VCS Hub
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${theme.badge}`}
              >
                {theme.providerLabel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{theme.subSubtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showGuide
                ? theme.guideBtnActive
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
              className={`w-3.5 h-3.5 ${isLoading ? `animate-spin ${theme.spinColor}` : ""}`}
            />
            <span>Sync</span>
          </button>

          <a
            href={VCS_URL}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm border ${theme.openBtn}`}
          >
            <span>{isGitLab ? "Open GitLab" : "Open GitHub"}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div
            className={`flex items-center gap-2 font-semibold border-b border-slate-800 pb-2 ${theme.guideHeader}`}
          >
            <Info className="w-4 h-4 shrink-0" />
            <span>VCS Hub & Review Workflow Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div
                  className={`flex items-center gap-1.5 font-semibold mb-1 ${theme.cardIcon}`}
                >
                  <GitMerge className="w-3.5 h-3.5 shrink-0" />
                  <span>{theme.feedName}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Switch between pull requests waiting for your approval (
                  <strong className="text-slate-200">To Review</strong>) and
                  your own opened requests across all repositories.
                </p>
              </div>
              <div
                className={`pt-2 text-[10px] font-mono border-t border-slate-800/40 ${theme.terminalCode}`}
              >
                <span>Tabs: To Review · {isGitLab ? "My MRs" : "My PRs"}</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isGitLab
                      ? "CI/CD Pipeline Status"
                      : "GitHub Actions Status"}
                  </span>
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
                <div
                  className={`flex items-center gap-1.5 font-semibold mb-1 ${theme.cardIcon}`}
                >
                  <Terminal className="w-3.5 h-3.5 shrink-0" />
                  <span>1-Click Branch Checkout</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Click the branch badge on any card to copy the exact{" "}
                  <code className={theme.terminalCode}>git checkout</code>{" "}
                  command directly to your clipboard.
                </p>
              </div>
              <div
                className={`pt-2 text-[10px] font-mono border-t border-slate-800/40 ${theme.terminalCode}`}
              >
                <span>git checkout feature/branch</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
