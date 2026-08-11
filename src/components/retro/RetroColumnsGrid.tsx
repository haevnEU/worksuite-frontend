import React from "react";
import { RetroResource } from "../../models/retroResource.model.ts";
import { RetroCard } from "./RetroCard.tsx";
import { CategoryType } from "../../types/retro.type.ts";

interface RetroColumnsGridProps {
  selectedRetro: RetroResource | null;
  onCopyItem: (item: string) => void;
  onRemoveItem: (listName: CategoryType, item: string) => Promise<void>;
}

export const RetroColumnsGrid: React.FC<RetroColumnsGridProps> = ({
  selectedRetro,
  onCopyItem,
  onRemoveItem,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-sm text-emerald-400 flex items-center space-x-2">
            <span>🟢 What Went Well</span>
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300">
            {selectedRetro?.positive?.length || 0}
          </span>
        </div>

        <div className="space-y-3">
          {selectedRetro?.positive?.map((item) => (
            <RetroCard
              key={item}
              item={item}
              listName="positive"
              borderColor="border-emerald-900/50"
              onCopy={onCopyItem}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </div>

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-sm text-rose-400 flex items-center space-x-2">
            <span>🔴 Needs Improvement</span>
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300">
            {selectedRetro?.negative?.length || 0}
          </span>
        </div>

        <div className="space-y-3">
          {selectedRetro?.negative?.map((item) => (
            <RetroCard
              key={item}
              item={item}
              listName="negative"
              borderColor="border-rose-900/50"
              onCopy={onCopyItem}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </div>

      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-sm text-blue-400 flex items-center space-x-2">
            <span>💡 Ideas & Action Items</span>
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300">
            {selectedRetro?.actionItems?.length || 0}
          </span>
        </div>

        <div className="space-y-3">
          {selectedRetro?.actionItems?.map((item) => (
            <RetroCard
              key={item}
              item={item}
              listName="action"
              borderColor="border-blue-900/50"
              onCopy={onCopyItem}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
