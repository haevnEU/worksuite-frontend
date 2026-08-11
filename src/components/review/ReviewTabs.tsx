import React from "react";
import { Archive, Layers } from "lucide-react";
import { ReviewTab } from "../../types/review.type.ts";

interface ReviewTabsProps {
  activeTab: ReviewTab;
  onTabChange: (tab: ReviewTab) => void;
}

export const ReviewTabs: React.FC<ReviewTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex bg-[#10192c]/80 p-1.5 rounded-xl border border-slate-800 w-fit gap-1">
      <button
        type="button"
        onClick={() => onTabChange("active")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          activeTab === "active"
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>Active Reviews</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("archived")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          activeTab === "archived"
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
        }`}
      >
        <Archive className="w-3.5 h-3.5" />
        <span>Archived</span>
      </button>
    </div>
  );
};
