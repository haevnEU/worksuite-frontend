import React from "react";
import { Copy, Trash2 } from "lucide-react";
import { CategoryType } from "../../types/retro.type.ts";

interface RetroCardProps {
  item: string;
  borderColor: string;
  listName: CategoryType;
  onCopy: (text: string) => void;
  onRemove: (listName: CategoryType, item: string) => Promise<void>;
}

export const RetroCard: React.FC<RetroCardProps> = ({
  item,
  borderColor,
  listName,
  onCopy,
  onRemove,
}) => (
  <div
    className={`bg-slate-900 p-4 rounded-xl border ${borderColor} shadow-xs flex flex-col justify-between space-y-3 font-sans`}
  >
    <p className="text-xs text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
      {item}
    </p>

    <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/60">
      <button
        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
        onClick={() => onCopy(item)}
        title="Copy to clipboard"
      >
        <Copy className="w-3.5 h-3.5 text-slate-400" />
      </button>

      <button
        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors cursor-pointer"
        onClick={async () => await onRemove(listName, item)}
        title="Remove item"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);
