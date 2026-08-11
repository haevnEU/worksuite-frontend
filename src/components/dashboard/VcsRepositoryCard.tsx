import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  GitPullRequest,
  PlayCircle,
} from "lucide-react";
import { useToast } from "../../toaster/ToastContext.tsx";
import { GitLabRepository } from "../../models/vcs.model.ts";
import { useSettings } from "../../context/SettingsContext.tsx";

interface VcsRepositoryCardProps {
  repo: GitLabRepository;
}

export const VcsRepositoryCard: React.FC<VcsRepositoryCardProps> = ({
  repo,
}) => {
  const { toastGood } = useToast();
  const { vcsProvider } = useSettings();

  const isGitLab = (vcsProvider || "GITLAB") === "GITLAB";

  const copyCloneCommand = (repo: GitLabRepository) => {
    const cmd = `git clone ${repo.webUrl}.git`;
    navigator.clipboard.writeText(cmd);
    toastGood(`Clone URL copied: ${cmd}`);
  };

  // Dynamische Links & Formatierung je nach Provider
  const mrLink = isGitLab
    ? `${repo.webUrl}/-/merge_requests`
    : `${repo.webUrl}/pulls`;

  const pipelineLink = isGitLab
    ? `${repo.webUrl}/-/pipelines`
    : `${repo.webUrl}/actions`;

  const prSymbol = isGitLab ? "!" : "#";
  const prLabel = isGitLab ? "MRs" : "PRs";
  const hoverAccent = isGitLab
    ? "group-hover:text-orange-400"
    : "group-hover:text-purple-400";
  const iconAccent = isGitLab ? "text-orange-400" : "text-purple-400";

  return (
    <div className="p-5 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 transition-all space-y-4 flex flex-col justify-between group">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <a
            href={repo.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-bold text-sm text-white ${hoverAccent} transition-colors flex items-center space-x-1`}
          >
            <span>{repo.name}</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {repo.lastPipelineStatus === "success" && (
            <a
              href={pipelineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-300 flex items-center space-x-1 border border-emerald-800/50 hover:bg-emerald-900/60 transition-colors"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{isGitLab ? "Pipeline Passed" : "Action Passed"}</span>
            </a>
          )}
          {repo.lastPipelineStatus === "running" && (
            <a
              href={pipelineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-950 text-blue-300 flex items-center space-x-1 border border-blue-800/50 hover:bg-blue-900/60 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              <span>Building...</span>
            </a>
          )}
          {repo.lastPipelineStatus === "failed" && (
            <a
              href={pipelineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-950 text-rose-300 flex items-center space-x-1 border border-rose-800/50 hover:bg-rose-900/60 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Failed</span>
            </a>
          )}
        </div>

        <p className="font-mono text-xs text-slate-400 truncate">{repo.path}</p>

        <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs">
          <a
            href={mrLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-700/60 text-slate-300 transition-all flex items-center justify-between text-[11px]"
          >
            <span className="flex items-center space-x-1">
              <GitPullRequest className={`w-3 h-3 ${iconAccent}`} />
              <span className="font-semibold">
                {repo.openMRCount || 0} {prLabel}
              </span>
            </span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
          </a>

          <a
            href={pipelineLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-700/60 text-slate-300 transition-all flex items-center justify-between text-[11px]"
          >
            <span className="flex items-center space-x-1">
              <PlayCircle className="w-3 h-3 text-blue-400" />
              <span className="font-semibold">
                {isGitLab ? "Pipelines" : "Actions"}
              </span>
            </span>
            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
          </a>
        </div>

        {repo.mergeRequests && repo.mergeRequests.length > 0 && (
          <div className="space-y-1 pt-1">
            {repo.mergeRequests.slice(0, 2).map((mr) => (
              <a
                key={mr.id}
                href={mr.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded bg-slate-900/40 hover:bg-slate-900 text-[11px] flex items-center justify-between text-slate-300 transition-colors border border-slate-800"
              >
                <span className="truncate pr-1 text-slate-300">
                  <strong className={`${iconAccent} font-mono`}>
                    {prSymbol}
                    {mr.iid}
                  </strong>{" "}
                  {mr.title}
                </span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500 shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
        <button
          type="button"
          onClick={() => copyCloneCommand(repo)}
          className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition-colors flex items-center space-x-1 cursor-pointer"
          title="Copy git clone command"
        >
          <Copy className="w-3 h-3" />
          <span>Clone URL</span>
        </button>

        <a
          href={repo.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 text-xs"
        >
          <span>Open {isGitLab ? "GitLab" : "GitHub"}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
