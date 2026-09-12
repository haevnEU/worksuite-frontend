import React from "react";
import { HttpStatusCategory, HttpStatusCode } from "../models/http.model.ts";
import { InteractiveCard } from "../../../shared/components/InteractiveCard.tsx";
import { CopyButton } from "../../../shared/components/CopyButton.tsx";

interface HttpStatusCardProps {
  item: HttpStatusCode;
  isSelected: boolean;
  onSelect: (item: HttpStatusCode) => void;
}

export const getCategoryBadgeStyle = (category: HttpStatusCategory): string => {
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
    default:
      return "bg-slate-800 text-slate-400 border-slate-700";
  }
};

export const HttpStatusCard: React.FC<HttpStatusCardProps> = React.memo(
  ({ item, isSelected, onSelect }) => {
    return (
      <InteractiveCard isSelected={isSelected} onClick={() => onSelect(item)}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xl font-black font-mono tracking-tight text-white group-hover:text-blue-400 transition-colors">
              {item.code}
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded border ${getCategoryBadgeStyle(
                item.category,
              )}`}
            >
              {item.category}
            </span>
          </div>

          <CopyButton
            textToCopy={`${item.code} ${item.phrase}`}
            title="Copy Status Line"
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center justify-center"
          />
        </div>

        <h3 className="text-xs font-bold text-slate-200 mb-1.5 truncate">
          {item.phrase}
        </h3>

        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </InteractiveCard>
    );
  },
);
