import React, { useState } from "react";
import {
  BarChart2,
  Calendar,
  Eye,
  EyeOff,
  Layers,
  LineChart,
  RotateCcw,
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext.tsx";
import { ChartType } from "../../types/settings.type.ts";
import { DaysRange, KpiType } from "../../types/kpi.type.ts";
import {
  getColorFor,
  resetColorFor,
  saveColorFor,
} from "../../utils/kpi.util.ts";

interface KpiConfig {
  key: string;
  type: KpiType;
  label: string;
  description: string;
}

const KPI_CONFIGS: KpiConfig[] = [
  {
    key: "movedQa",
    type: "MOVED_TO_QA",
    label: "Moved to QA",
    description:
      "Display number of tickets moved to Quality Assurance per day.",
  },
  {
    key: "fromQa",
    type: "RETURN_FROM_QA",
    label: "Returned from QA",
    description:
      "Display number of tickets returned from QA back to development.",
  },
  {
    key: "movedReview",
    type: "MOVED_TO_REVIEW",
    label: "Moved to Review",
    description: "Display number of tickets submitted for Code Review.",
  },
  {
    key: "fromReview",
    type: "RETURN_FROM_REVIEW",
    label: "Returned from Review",
    description: "Display number of tickets returned from Code Review.",
  },
];

export const KpiSettingsSection: React.FC = () => {
  const {
    enabledKpis,
    enableKpi,
    setAllKpis,
    daysRange,
    setDaysRange,
    chartType,
    setChartType,
  } = useSettings();

  const [_, setRefreshState] = useState({});

  const forceRerender = () => setRefreshState({});

  const handleColorChange = (type: KpiType, newColor: string) => {
    saveColorFor(type, newColor);
    forceRerender();
  };

  const handleResetColor = (type: KpiType) => {
    resetColorFor(type);
    forceRerender();
  };

  const areAllKpisEnabled = Object.values(enabledKpis || {}).every(
    (val) => val === true,
  );

  const handleToggleAllKpis = () => {
    if (setAllKpis) {
      setAllKpis(!areAllKpisEnabled);
    }
  };

  const chartTypeOptions: {
    type: ChartType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { type: "bar", label: "Bars", icon: <BarChart2 className="w-3.5 h-3.5" /> },
    {
      type: "line",
      label: "Lines",
      icon: <LineChart className="w-3.5 h-3.5" />,
    },
    { type: "both", label: "Both", icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xs space-y-6 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-extrabold text-white">
            KPI Chart Display Settings
          </h2>
        </div>

        <button
          type="button"
          onClick={handleToggleAllKpis}
          className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] font-bold transition-colors cursor-pointer"
        >
          {areAllKpisEnabled ? (
            <EyeOff className="w-3 h-3 text-rose-400" />
          ) : (
            <Eye className="w-3 h-3 text-emerald-400" />
          )}
          <span>{areAllKpisEnabled ? "Disable All" : "Enable All"}</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-xs pb-4 border-b border-slate-800/60">
        <div className="space-y-0.5 pr-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <label className="font-bold text-slate-200 text-xs block">
              Chart Representation
            </label>
          </div>
          <p className="text-slate-400 text-[11px] pl-5">
            Choose whether to display metrics as bars, trendlines, or both
            combined.
          </p>
        </div>

        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80 text-xs font-bold shrink-0">
          {chartTypeOptions.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => setChartType(opt.type)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                chartType === opt.type
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pb-4 border-b border-slate-800/60">
        <div className="space-y-0.5 pr-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <label className="font-bold text-slate-200 text-xs block">
              Default Time Range
            </label>
          </div>
          <p className="text-slate-400 text-[11px] pl-5">
            Default history length rendered in the KPI chart widget.
          </p>
        </div>

        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80 text-xs font-bold shrink-0">
          {([7, 14, 21] as DaysRange[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDaysRange(range)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                daysRange === range
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {range} Days
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-slate-800/60 space-y-3 pt-1">
        {KPI_CONFIGS.map((kpi) => {
          const currentColor = getColorFor(kpi.type);
          const isCustomColor =
            typeof window !== "undefined" &&
            localStorage.getItem(`kpi_color_${kpi.type}`) !== null;

          const isEnabled =
            enabledKpis?.[kpi.key as keyof typeof enabledKpis] ?? true;

          return (
            <div
              key={kpi.key}
              className="flex items-center justify-between text-xs pt-3 first:pt-0"
            >
              <div className="space-y-0.5 pr-4">
                <div className="flex items-center space-x-2">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) =>
                        handleColorChange(kpi.type, e.target.value)
                      }
                      className="w-4 h-4 rounded-full border-0 cursor-pointer p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full shadow-xs"
                      title="Click to change color"
                    />
                  </div>

                  <label className="font-bold text-slate-200 text-xs block">
                    {kpi.label}
                  </label>

                  {isCustomColor && (
                    <button
                      type="button"
                      onClick={() => handleResetColor(kpi.type)}
                      className="text-slate-500 hover:text-slate-300 p-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-[10px] bg-slate-800/60 border border-slate-700/50"
                      title="Reset to default color"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
                <p className="text-slate-400 text-[11px] pl-6">
                  {kpi.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => enableKpi(kpi.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isEnabled ? "bg-indigo-600" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
