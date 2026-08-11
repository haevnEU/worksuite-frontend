import React from "react";
import { Code2, ExternalLink, GitPullRequest, PlayCircle } from "lucide-react";
import { useVCS } from "../../context/VcsContext.tsx";
import { VcsRepositoryCard } from "./VcsRepositoryCard.tsx";

export const VcsRepositoriesSection: React.FC = () => {
  const { repos, vcsLink } = useVCS();

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">
                Repositories & Pipeline Links
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-950 text-orange-300 border border-orange-800/60">
                VCS Integration
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Quick access to repositories, merge requests, and CI/CD pipeline
              statuses
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <a
            href={`${vcsLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900/60 text-orange-200 border border-orange-800/60 font-medium transition-colors flex items-center space-x-1"
          >
            <GitPullRequest className="w-3.5 h-3.5 text-orange-400" />
            <span>Merge Requests</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <a
            href={`${vcsLink}/-/pipelines`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 text-blue-200 border border-blue-800/60 font-medium transition-colors flex items-center space-x-1"
          >
            <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Pipelines</span>
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
