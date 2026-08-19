import React from "react";
import { Shield, RefreshCw, Database } from "lucide-react";
import { HttpMethodDetail } from "../../../models/network.model.ts";
import { getMethodBadgeColor } from "../../../utils/http.util.ts";

interface HttpMethodCardProps {
  item: HttpMethodDetail;
  isSelected: boolean;
  onSelect: (item: HttpMethodDetail) => void;
}

export const HttpMethodCard: React.FC<HttpMethodCardProps> = ({
  item,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? "bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
          : "bg-slate-900/80 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`px-2.5 py-1 text-xs font-black font-mono tracking-wider rounded-lg border ${getMethodBadgeColor(
            item.method,
          )}`}
        >
          {item.method}
        </span>

        <div className="flex items-center gap-1.5 text-[10px]">
          {item.isSafe && (
            <span
              className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold"
              title="Safe: Does not alter server state"
            >
              Safe
            </span>
          )}
          {item.isIdempotent && (
            <span
              className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold"
              title="Idempotent: Multiple identical requests have same effect"
            >
              Idempotent
            </span>
          )}
        </div>
      </div>

      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
        {item.description}
      </p>

      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
        <span className="font-mono truncate max-w-[200px]">
          {item.sampleEndpoint}
        </span>
        <span className="shrink-0">{item.rfc.split(",")[0]}</span>
      </div>
    </div>
  );
};
