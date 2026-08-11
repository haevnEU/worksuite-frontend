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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold border border-orange-500/20">
          <GitPullRequest className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-white">VCS Hub</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Code Reviews, Merge Requests & CI/CD Pipelines
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>Sync</span>
        </button>

        <a
          href={`${VCS_URL}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-2 px-3.5 py-2 bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold transition-colors"
        >
          <span>Open VCS</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
