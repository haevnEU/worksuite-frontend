import React from "react";
import { ExternalLink, GitPullRequest, RefreshCw } from "lucide-react";
import { VCS_URL } from "../../constants/url.constant.ts";

interface VcsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export const VcsHeader: React.FC<VcsHeaderProps> = ({
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg">
      {/* Linke Seite: Icon, Titel, Badge & Subtitle */}
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

      {/* Rechte Seite: Sync Action & External Link Button */}
      <div className="flex items-center gap-3 self-start md:self-center shrink-0">
        {/* Sync Button */}
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

        {/* Open VCS Pill Button */}
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
  );
};
