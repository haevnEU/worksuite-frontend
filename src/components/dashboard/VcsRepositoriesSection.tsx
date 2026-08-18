import React from "react";
import {
  Code2,
  ExternalLink,
  GitPullRequest,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { useVCS } from "../../context/VcsContext.tsx";
import { useSettings } from "../../context/SettingsContext.tsx";
import { VcsRepositoryCard } from "./VcsRepositoryCard.tsx";

export const VcsRepositoriesSection: React.FC = () => {
  const { repos, vcsLink, pendingReviews } = useVCS();
  const { vcsProvider } = useSettings();

  const isGitLab = (vcsProvider || "GITLAB") === "GITLAB";
  const pendingReviewsCount = pendingReviews?.length || 0;

  // Dynamische Styles & Labels je nach Provider
  const theme = {
    iconBg: isGitLab ? "bg-orange-500/10" : "bg-purple-500/10",
    iconColor: isGitLab ? "text-orange-400" : "text-purple-400",
    badgeBg: isGitLab ? "bg-orange-950" : "bg-purple-950",
    badgeText: isGitLab ? "text-orange-300" : "text-purple-300",
    badgeBorder: isGitLab ? "border-orange-800/60" : "border-purple-800/60",
    mrBtnBg: isGitLab
      ? "bg-orange-950/60 hover:bg-orange-900/60 text-orange-200 border-orange-800/60"
      : "bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border-purple-800/60",
    mrIconColor: isGitLab ? "text-orange-400" : "text-purple-400",
    mrLabel: isGitLab ? "Merge Requests" : "Pull Requests",
    mrUrlPath: isGitLab ? "/dashboard/merge_requests" : "/pulls",
    pipelineUrlPath: isGitLab ? "/dashboard/pipelines" : "/actions",
    pipelineLabel: isGitLab ? "Pipelines" : "Actions",
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center font-bold transition-colors`}
          >
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">
                Repositories & Pipeline Links
              </h2>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} transition-colors`}
              >
                {isGitLab ? "GitLab Integration" : "GitHub Integration"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Quick access to repositories,{" "}
              {isGitLab ? "merge requests" : "pull requests"}, and CI/CD
              pipeline statuses
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {pendingReviewsCount > 0 && (
            <div className="px-2.5 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {pendingReviewsCount} Review{pendingReviewsCount > 1 ? "s" : ""}{" "}
                open
              </span>
            </div>
          )}

          <a
            href={`${vcsLink}${theme.mrUrlPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors flex items-center space-x-1 cursor-pointer ${theme.mrBtnBg}`}
          >
            <GitPullRequest className={`w-3.5 h-3.5 ${theme.mrIconColor}`} />
            <span>{theme.mrLabel}</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <a
            href={`${vcsLink}${theme.pipelineUrlPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border border-blue-800/60 font-medium transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>{theme.pipelineLabel}</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {repos.map((repo) => (
          <VcsRepositoryCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
};
