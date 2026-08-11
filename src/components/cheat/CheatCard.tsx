import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { CheatItem } from "../../models/cheat.model.ts";
import { getLevelBadgeClass } from "../../utils/cheat.util.ts";

interface CheatCardProps {
  item: CheatItem;
  isSelected: boolean;
  onSelect: (item: CheatItem) => void;
}

export const CheatCard: React.FC<CheatCardProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.syntax);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
        isSelected
          ? "bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
          : "bg-slate-900/80 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
          {item.level && (
            <span
              className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border shrink-0 ${getLevelBadgeClass(
                item.level,
              )}`}
            >
              {item.level}
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {item.description}
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative group/code">
          <pre className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-emerald-400 overflow-hidden text-ellipsis whitespace-nowrap pr-8">
            {item.syntax}
          </pre>

          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all shadow-xs"
            title="Copy command"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1 overflow-hidden">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono text-slate-500 bg-slate-950/60 px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
