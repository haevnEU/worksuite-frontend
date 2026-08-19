import React from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { HttpStatusCategory } from "../../types/network.types.ts";
import type { HttpStatusCode } from "../../models/network.model.ts";

interface HttpStatusCardProps {
  item: HttpStatusCode;
  isSelected: boolean;
  onSelect: (item: HttpStatusCode) => void;
}

export const getCategoryBadgeStyle = (category: HttpStatusCategory) => {
  switch (category) {
    case "1xx":
      return "bg-sky-500/10 text-sky-400 border-sky-500/30";
    case "2xx":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "3xx":
      return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    case "4xx":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "5xx":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  }
};

export const HttpStatusCard: React.FC<HttpStatusCardProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${item.code} ${item.phrase}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? "bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
          : "bg-slate-900/80 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl font-black font-mono tracking-tight text-white group-hover:text-blue-400 transition-colors">
            {item.code}
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded border ${getCategoryBadgeStyle(item.category)}`}
          >
            {item.category}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
          title="Copy Status Line"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      <h3 className="text-xs font-bold text-slate-200 mb-1.5 truncate">
        {item.phrase}
      </h3>

      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
        {item.description}
      </p>
    </div>
  );
};
