import React, { useState } from "react";
import { GitMerge, GitPullRequest } from "lucide-react";
import { useSettings } from "../../context/SettingsContext.tsx";
import { MergeRequestModel } from "../../models/vcs.model.ts";
import { MergeRequestCard } from "./MergeRequestCard";

interface MergeRequestListProps {
  pendingReviews: MergeRequestModel[];
  myMrs: MergeRequestModel[];
}

export const MergeRequestList: React.FC<MergeRequestListProps> = ({
  pendingReviews,
  myMrs,
}) => {
  const { vcsProvider } = useSettings();
  const isGitLab = (vcsProvider || "GITLAB") === "GITLAB";
  const [activeTab, setActiveTab] = useState<"reviews" | "my">("reviews");

  const currentList = activeTab === "reviews" ? pendingReviews : myMrs;

  const activeTabClass = isGitLab
    ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
    : "bg-purple-600 text-white shadow-md shadow-purple-600/20";

  return (
    <div className="space-y-4">
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "reviews"
              ? activeTabClass
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>To Review</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px]">
            {pendingReviews.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("my")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "my"
              ? activeTabClass
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <GitMerge className="w-3.5 h-3.5" />
          <span>{isGitLab ? "My Merge Requests" : "My Pull Requests"}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px]">
            {myMrs.length}
          </span>
        </button>
      </div>

      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-8 text-center text-slate-500 text-xs">
            {activeTab === "reviews"
              ? "Keine offenen Reviews ausstehend 🎉"
              : isGitLab
                ? "Keine eigenen Merge Requests offen."
                : "Keine eigenen Pull Requests offen."}
          </div>
        ) : (
          currentList.map((mr) => <MergeRequestCard key={mr.id} mr={mr} />)
        )}
      </div>
    </div>
  );
};
