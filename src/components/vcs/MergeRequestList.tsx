import React, { useState } from "react";
import { GitPullRequest, GitMerge } from "lucide-react";
import { MergeRequestCard } from "./MergeRequestCard";
import { MergeRequestModel } from "../../models/vcs.model.ts";

interface MergeRequestListProps {
  pendingReviews: MergeRequestModel[];
  myMrs: MergeRequestModel[];
}

export const MergeRequestList: React.FC<MergeRequestListProps> = ({
  pendingReviews,
  myMrs,
}) => {
  const [activeTab, setActiveTab] = useState<"reviews" | "my">("reviews");

  const currentList = activeTab === "reviews" ? pendingReviews : myMrs;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "reviews"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
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
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <GitMerge className="w-3.5 h-3.5" />
          <span>My Merge Requests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px]">
            {myMrs.length}
          </span>
        </button>
      </div>

      {/* Cards Stream */}
      <div className="space-y-3">
        {currentList.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-8 text-center text-slate-500 text-xs">
            {activeTab === "reviews"
              ? "Keine offenen Reviews ausstehend 🎉"
              : "Keine eigenen Merge Requests offen."}
          </div>
        ) : (
          currentList.map((mr) => <MergeRequestCard key={mr.id} mr={mr} />)
        )}
      </div>
    </div>
  );
};
