import React from "react";
import { PlusCircle } from "lucide-react";
import { KpiType } from "../../../types/kpi.type.ts";

interface KpiActionButtonProps {
  label: string;
  color: string;
  averageValue: string;
  kpiType?: KpiType;
  unit?: string;
  isDisabled?: boolean;
  onIncrement?: (type: KpiType) => void;
}

export const KpiActionButton: React.FC<KpiActionButtonProps> = ({
  label,
  color,
  averageValue,
  kpiType,
  unit = " / day",
  isDisabled = false,
  onIncrement,
}) => {
  return (
    <div
      className="flex items-center justify-between bg-slate-900/80 p-2 pl-3 rounded-lg border gap-2 shadow-xs"
      style={{ borderColor: `${color}40` }}
    >
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-semibold text-slate-200">{label}</span>
        </div>
        <span className="text-[10px] font-mono pl-4" style={{ color }}>
          Avg: <strong className="font-bold">{averageValue}</strong>
          {unit}
        </span>
      </div>

      {kpiType && onIncrement && (
        <button
          type="button"
          onClick={() => onIncrement(kpiType)}
          disabled={isDisabled}
          style={{
            borderColor: `${color}60`,
            backgroundColor: `${color}15`,
            color,
          }}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer hover:brightness-125 active:scale-95 disabled:opacity-50"
        >
          <PlusCircle className="w-3.5 h-3.5" style={{ color }} />
          <span>+1</span>
        </button>
      )}
    </div>
  );
};
