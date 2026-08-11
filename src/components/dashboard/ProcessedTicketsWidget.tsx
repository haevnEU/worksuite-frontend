import React, { useEffect, useMemo, useState } from "react";
import { PlusCircle, RefreshCw, TrendingUp } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSettings } from "../../context/SettingsContext.tsx";
import { useKPI } from "../../context/KPIContext.tsx";
import { getColorFor } from "../../utils/kpi.util.ts";
import { kpiService } from "../../services/network/kpi.service.ts";
import { useToast } from "../../toaster/ToastContext.tsx";
import { DaysRange, KpiType } from "../../types/kpi.type.ts";

export const ProcessedTicketsWidget: React.FC = () => {
  const { enabledKpis, daysRange: defaultDaysRange, chartType } = useSettings();
  const { data, refresh } = useKPI();
  const { toastBad } = useToast();
  const [selectedRange, setSelectedRange] = useState<DaysRange>(
    defaultDaysRange || 7,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeAction, setActiveAction] = useState<KpiType | null>(null);

  useEffect(() => {
    if (defaultDaysRange) {
      setSelectedRange(defaultDaysRange);
    }
  }, [defaultDaysRange]);

  const colors = useMemo(() => {
    return {
      hoursSpent: getColorFor("HOURS_SPENT"),
      movedToQa: getColorFor("MOVED_TO_QA"),
      returnFromQa: getColorFor("RETURN_FROM_QA"),
      movedToReview: getColorFor("MOVED_TO_REVIEW"),
      returnFromReview: getColorFor("RETURN_FROM_REVIEW"),
    };
  }, []);

  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const sorted = [...data].sort((a, b) => {
      const dateA = new Date(a.day || 0).getTime();
      const dateB = new Date(b.day || 0).getTime();
      return dateA - dateB;
    });

    const normalized = sorted.map((item) => ({
      ...item,
      hoursSpent: item.hoursSpent ?? 0,
      movedQa: item.movedToQA ?? 0,
      fromQa: item.returnFromQA ?? 0,
      movedToReview: item.movedToReview ?? 0,
      returnFromReview: item.returnFromReview ?? 0,
    }));

    return normalized.slice(-selectedRange);
  }, [data, selectedRange]);

  const averages = useMemo(() => {
    if (!processedData.length) {
      return {
        hoursSpent: "0.0",
        movedToQa: "0.0",
        returnFromQa: "0.0",
        movedToReview: "0.0",
        returnFromReview: "0.0",
      };
    }

    const total = processedData.reduce(
      (acc, curr) => ({
        hoursSpent: acc.hoursSpent + (curr.hoursSpent || 0),
        movedToQa: acc.movedToQa + (curr.movedToQA || 0),
        returnFromQa: acc.returnFromQa + (curr.returnFromQA || 0),
        movedToReview: acc.movedToReview + (curr.movedToReview || 0),
        returnFromReview: acc.returnFromReview + (curr.returnFromReview || 0),
      }),
      {
        hoursSpent: 0,
        movedToQa: 0,
        returnFromQa: 0,
        movedToReview: 0,
        returnFromReview: 0,
      },
    );

    const count = processedData.length;

    return {
      hoursSpent: (total.hoursSpent / count).toFixed(1),
      movedToQa: (total.movedToQa / count).toFixed(1),
      returnFromQa: (total.returnFromQa / count).toFixed(1),
      movedToReview: (total.movedToReview / count).toFixed(1),
      returnFromReview: (total.returnFromReview / count).toFixed(1),
    };
  }, [processedData]);

  const handleRefresh = async () => {
    if (!refresh) return;
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const handleUpdateKpi = async (type: KpiType) => {
    if (!processedData.length) return;

    setActiveAction(type);
    const latestItem = processedData[processedData.length - 1];
    if (!latestItem?.id) {
      toastBad("Cannot update KPI");
      return;
    }
    await kpiService.increment(latestItem.id, type);
    await refresh();
    setActiveAction(null);
  };

  const hasActiveMetrics =
    enabledKpis &&
    (enabledKpis.spentHours ||
      enabledKpis.movedQa ||
      enabledKpis.fromQa ||
      enabledKpis.movedReview ||
      enabledKpis.fromReview);

  if (!hasActiveMetrics) {
    return null;
  }

  const showBars = chartType === "bar" || chartType === "both";
  const showLines = chartType === "line" || chartType === "both";

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-base font-extrabold text-white">
                Processed Tickets per Day
              </h2>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing || activeAction !== null}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700 disabled:opacity-50"
                title="Refresh KPI Data"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isRefreshing ? "animate-spin text-indigo-400" : ""
                  }`}
                />
              </button>

              <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-[11px] font-bold">
                {([7, 14, 21] as DaysRange[]).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => setSelectedRange(range)}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      selectedRange === range
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {range}D
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily overview of ticket activity and logged metrics
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        <div className="lg:col-span-8 xl:col-span-9 h-80 w-full">
          {processedData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-semibold">
              No KPI data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={processedData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />

                {showBars && enabledKpis?.spentHours && (
                  <Bar
                    dataKey="hoursSpent"
                    name="Worked hours"
                    fill={colors.hoursSpent}
                    radius={[4, 4, 0, 0]}
                    opacity={chartType === "both" ? 0.7 : 0.85}
                  />
                )}
                {showBars && enabledKpis?.movedQa && (
                  <Bar
                    dataKey="movedToQa"
                    name="Moved to QA"
                    fill={colors.movedToQa}
                    radius={[4, 4, 0, 0]}
                    opacity={chartType === "both" ? 0.7 : 0.85}
                  />
                )}
                {showBars && enabledKpis?.fromQa && (
                  <Bar
                    dataKey="returnFromQa"
                    name="Returned from QA"
                    fill={colors.returnFromQa}
                    radius={[4, 4, 0, 0]}
                    opacity={chartType === "both" ? 0.7 : 0.85}
                  />
                )}
                {showBars && enabledKpis?.movedReview && (
                  <Bar
                    dataKey="movedToReview"
                    name="Moved to Review"
                    fill={colors.movedToReview}
                    radius={[4, 4, 0, 0]}
                    opacity={chartType === "both" ? 0.7 : 0.85}
                  />
                )}
                {showBars && enabledKpis?.fromReview && (
                  <Bar
                    dataKey="returnFromReview"
                    name="Returned from Review"
                    fill={colors.returnFromReview}
                    radius={[4, 4, 0, 0]}
                    opacity={chartType === "both" ? 0.7 : 0.85}
                  />
                )}

                {showLines && enabledKpis?.spentHours && (
                  <Line
                    type="monotone"
                    dataKey="hoursSpent"
                    name={
                      chartType === "both"
                        ? "Worked hours (Trend)"
                        : "Worked hours"
                    }
                    stroke={colors.hoursSpent}
                    strokeWidth={2}
                    dot={{ r: 3, fill: colors.hoursSpent }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {showLines && enabledKpis?.movedQa && (
                  <Line
                    type="monotone"
                    dataKey="movedToQa"
                    name={
                      chartType === "both"
                        ? "Moved to QA (Trend)"
                        : "Moved to QA"
                    }
                    stroke={colors.movedToQa}
                    strokeWidth={2}
                    dot={{ r: 3, fill: colors.movedToQa }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {showLines && enabledKpis?.fromQa && (
                  <Line
                    type="monotone"
                    dataKey="returnFromQa"
                    name={
                      chartType === "both"
                        ? "Returned from QA (Trend)"
                        : "Returned from QA"
                    }
                    stroke={colors.returnFromQa}
                    strokeWidth={2}
                    dot={{ r: 3, fill: colors.returnFromQa }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {showLines && enabledKpis?.movedReview && (
                  <Line
                    type="monotone"
                    dataKey="movedToReview"
                    name={
                      chartType === "both"
                        ? "Moved to Review (Trend)"
                        : "Moved to Review"
                    }
                    stroke={colors.movedToReview}
                    strokeWidth={2}
                    dot={{ r: 3, fill: colors.movedToReview }}
                    activeDot={{ r: 5 }}
                  />
                )}
                {showLines && enabledKpis?.fromReview && (
                  <Line
                    type="monotone"
                    dataKey="returnFromReview"
                    name={
                      chartType === "both"
                        ? "Returned from Review (Trend)"
                        : "Returned from Review"
                    }
                    stroke={colors.returnFromReview}
                    strokeWidth={2}
                    dot={{ r: 3, fill: colors.returnFromReview }}
                    activeDot={{ r: 5 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sidebar Rechts: Integrierte Actions & dynamische Farben */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            Quick Actions & Averages
          </span>

          {/* Worked Hours */}
          {enabledKpis?.spentHours && (
            <div
              className="flex items-center justify-between bg-slate-900/80 p-2 pl-3 rounded-lg border shadow-xs"
              style={{ borderColor: `${colors.hoursSpent}40` }}
            >
              <div className="flex items-center space-x-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: colors.hoursSpent }}
                ></span>
                <span className="text-xs font-semibold text-slate-200">
                  Worked Hours
                </span>
              </div>
              <span
                className="text-xs font-mono font-bold"
                style={{ color: colors.hoursSpent }}
              >
                {averages.hoursSpent}h / day
              </span>
            </div>
          )}

          {/* Moved to QA */}
          {enabledKpis?.movedQa && (
            <div
              className="flex items-center justify-between bg-slate-900/80 p-2 pl-3 rounded-lg border gap-2 shadow-xs"
              style={{ borderColor: `${colors.movedToQa}40` }}
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: colors.movedToQa }}
                  ></span>
                  <span className="text-xs font-semibold text-slate-200">
                    Moved to QA
                  </span>
                </div>
                <span
                  className="text-[10px] font-mono pl-4"
                  style={{ color: colors.movedToQa }}
                >
                  Avg:{" "}
                  <strong className="font-bold">{averages.movedToQa}</strong> /
                  day
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateKpi("MOVED_TO_QA")}
                disabled={activeAction !== null}
                style={{
                  borderColor: `${colors.movedToQa}60`,
                  backgroundColor: `${colors.movedToQa}15`,
                  color: colors.movedToQa,
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer hover:brightness-125 active:scale-95 disabled:opacity-50"
              >
                <PlusCircle
                  className="w-3.5 h-3.5"
                  style={{ color: colors.movedToQa }}
                />
                <span>+1</span>
              </button>
            </div>
          )}

          {/* Returned from QA */}
          {enabledKpis?.fromQa && (
            <div
              className="flex items-center justify-between bg-slate-900/80 p-2 pl-3 rounded-lg border gap-2 shadow-xs"
              style={{ borderColor: `${colors.returnFromQa}40` }}
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: colors.returnFromQa }}
                  ></span>
                  <span className="text-xs font-semibold text-slate-200">
                    Returned from QA
                  </span>
                </div>
                <span
                  className="text-[10px] font-mono pl-4"
                  style={{ color: colors.returnFromQa }}
                >
                  Avg:{" "}
                  <strong className="font-bold">{averages.returnFromQa}</strong>{" "}
                  / day
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateKpi("RETURN_FROM_QA")}
                disabled={activeAction !== null}
                style={{
                  borderColor: `${colors.returnFromQa}60`,
                  backgroundColor: `${colors.returnFromQa}15`,
                  color: colors.returnFromQa,
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer hover:brightness-125 active:scale-95 disabled:opacity-50"
              >
                <PlusCircle
                  className="w-3.5 h-3.5"
                  style={{ color: colors.returnFromQa }}
                />
                <span>+1</span>
              </button>
            </div>
          )}

          {/* Moved to Review */}
          {enabledKpis?.movedReview && (
            <div
              className="flex items-center justify-between bg-slate-900/80 p-2 pl-3 rounded-lg border gap-2 shadow-xs"
              style={{ borderColor: `${colors.movedToReview}40` }}
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: colors.movedToReview }}
                  ></span>
                  <span className="text-xs font-semibold text-slate-200">
                    Moved to Review
                  </span>
                </div>
                <span
                  className="text-[10px] font-mono pl-4"
                  style={{ color: colors.movedToReview }}
                >
                  Avg:{" "}
                  <strong className="font-bold">
                    {averages.movedToReview}
                  </strong>{" "}
                  / day
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateKpi("MOVED_TO_REVIEW")}
                disabled={activeAction !== null}
                style={{
                  borderColor: `${colors.movedToReview}60`,
                  backgroundColor: `${colors.movedToReview}15`,
                  color: colors.movedToReview,
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer hover:brightness-125 active:scale-95 disabled:opacity-50"
              >
                <PlusCircle
                  className="w-3.5 h-3.5"
                  style={{ color: colors.movedToReview }}
                />
                <span>+1</span>
              </button>
            </div>
          )}

          {/* Returned from Review */}
          {enabledKpis?.fromReview && (
            <div
              className="flex items-center justify-between bg-slate-900/80 p-2 pl-3 rounded-lg border gap-2 shadow-xs"
              style={{ borderColor: `${colors.returnFromReview}40` }}
            >
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: colors.returnFromReview }}
                  ></span>
                  <span className="text-xs font-semibold text-slate-200">
                    Returned from Review
                  </span>
                </div>
                <span
                  className="text-[10px] font-mono pl-4"
                  style={{ color: colors.returnFromReview }}
                >
                  Avg:{" "}
                  <strong className="font-bold">
                    {averages.returnFromReview}
                  </strong>{" "}
                  / day
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateKpi("RETURN_FROM_REVIEW")}
                disabled={activeAction !== null}
                style={{
                  borderColor: `${colors.returnFromReview}60`,
                  backgroundColor: `${colors.returnFromReview}15`,
                  color: colors.returnFromReview,
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer hover:brightness-125 active:scale-95 disabled:opacity-50"
              >
                <PlusCircle
                  className="w-3.5 h-3.5"
                  style={{ color: colors.returnFromReview }}
                />
                <span>+1</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
