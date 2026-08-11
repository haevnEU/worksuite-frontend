import React from "react";
import {
  GitPullRequest,
  GitMerge,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface GitLabKpiCardsProps {
  pendingReviewsCount: number;
  myMrCount: number;
  failedPipelinesCount: number;
}

export const GitLabKpiCards: React.FC<GitLabKpiCardsProps> = ({
  pendingReviewsCount,
  myMrCount,
  failedPipelinesCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Pending Reviews */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Pending Reviews
          </span>
          <div className="text-xl font-black text-white mt-0.5">
            {pendingReviewsCount}
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
          <GitPullRequest className="w-4 h-4" />
        </div>
      </div>

      {/* My MRs */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            My Open MRs
          </span>
          <div className="text-xl font-black text-white mt-0.5">
            {myMrCount}
          </div>
        </div>
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
          <GitMerge className="w-4 h-4" />
        </div>
      </div>

      {/* Failed Pipelines */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Broken Builds
          </span>
          <div className="text-xl font-black text-white mt-0.5">
            {failedPipelinesCount}
          </div>
        </div>
        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
            failedPipelinesCount > 0
              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          }`}
        >
          {failedPipelinesCount > 0 ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
};
