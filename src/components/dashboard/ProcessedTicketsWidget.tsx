import React from "react";
import { useProcessedTickets } from "../../hooks/useProcessedTickets.ts";
import { KpiWidgetHeader } from "./kpi/KpiWidgetHeader.tsx";
import { KpiChart } from "./kpi/KpiChart.tsx";
import { KpiActionButton } from "./kpi/KpiActionButton.tsx";

export const ProcessedTicketsWidget: React.FC = () => {
  const {
    enabledKpis,
    chartType,
    selectedRange,
    isRefreshing,
    activeAction,
    colors,
    processedData,
    averages,
    hasActiveMetrics,
    setSelectedRange,
    handleRefresh,
    handleUpdateKpi,
  } = useProcessedTickets();

  if (!hasActiveMetrics) return null;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm space-y-4 font-sans">
      <KpiWidgetHeader
        selectedRange={selectedRange}
        isRefreshing={isRefreshing}
        isDisabled={isRefreshing || activeAction !== null}
        onRangeChange={setSelectedRange}
        onRefresh={handleRefresh}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        <div className="lg:col-span-8 xl:col-span-9 h-80 w-full">
          <KpiChart
            data={processedData}
            colors={colors}
            enabledKpis={enabledKpis}
            chartType={chartType}
          />
        </div>
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-2.5 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            Quick Actions & Averages
          </span>

          {enabledKpis?.movedQa && (
            <KpiActionButton
              label="Moved to QA"
              color={colors.movedToQa}
              averageValue={averages.movedToQa}
              kpiType="MOVED_TO_QA"
              isDisabled={activeAction !== null}
              onIncrement={handleUpdateKpi}
            />
          )}

          {enabledKpis?.fromQa && (
            <KpiActionButton
              label="Returned from QA"
              color={colors.returnFromQa}
              averageValue={averages.returnFromQa}
              kpiType="RETURN_FROM_QA"
              isDisabled={activeAction !== null}
              onIncrement={handleUpdateKpi}
            />
          )}

          {enabledKpis?.movedReview && (
            <KpiActionButton
              label="Moved to Review"
              color={colors.movedToReview}
              averageValue={averages.movedToReview}
              kpiType="MOVED_TO_REVIEW"
              isDisabled={activeAction !== null}
              onIncrement={handleUpdateKpi}
            />
          )}

          {enabledKpis?.fromReview && (
            <KpiActionButton
              label="Returned from Review"
              color={colors.returnFromReview}
              averageValue={averages.returnFromReview}
              kpiType="RETURN_FROM_REVIEW"
              isDisabled={activeAction !== null}
              onIncrement={handleUpdateKpi}
            />
          )}
        </div>
      </div>
    </div>
  );
};
