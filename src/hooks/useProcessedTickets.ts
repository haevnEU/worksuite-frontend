import { useEffect, useMemo, useState } from "react";
import { useSettings } from "../context/SettingsContext.tsx";
import { useKPI } from "../context/KPIContext.tsx";
import { useToast } from "../toaster/ToastContext.tsx";
import { DaysRange, KpiType } from "../types/kpi.type.ts";
import { getColorFor } from "../utils/kpi.util.ts";
import { kpiService } from "../services/network/kpi.service.ts";

export function useProcessedTickets() {
  const { enabledKpis, daysRange: defaultDaysRange, chartType } = useSettings();
  const { data, refresh } = useKPI();
  const { toastBad } = useToast();

  const [selectedRange, setSelectedRange] = useState<DaysRange>(
    defaultDaysRange || 7,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeAction, setActiveAction] = useState<KpiType | null>(null);

  useEffect(() => {
    if (defaultDaysRange) setSelectedRange(defaultDaysRange);
  }, [defaultDaysRange]);

  const colors = useMemo(
    () => ({
      hoursSpent: getColorFor("HOURS_SPENT"),
      movedToQa: getColorFor("MOVED_TO_QA"),
      returnFromQa: getColorFor("RETURN_FROM_QA"),
      movedToReview: getColorFor("MOVED_TO_REVIEW"),
      returnFromReview: getColorFor("RETURN_FROM_REVIEW"),
    }),
    [],
  );

  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const sorted = [...data].sort(
      (a, b) => new Date(a.day || 0).getTime() - new Date(b.day || 0).getTime(),
    );

    return sorted
      .map((item) => ({
        ...item,
        hoursSpent: item.hoursSpent ?? 0,
        movedQa: item.movedToQA ?? 0,
        fromQa: item.returnFromQA ?? 0,
        movedToReview: item.movedToReview ?? 0,
        returnFromReview: item.returnFromReview ?? 0,
      }))
      .slice(-selectedRange);
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

    const count = processedData.length;
    const sum = processedData.reduce(
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

    return {
      hoursSpent: (sum.hoursSpent / count).toFixed(1),
      movedToQa: (sum.movedToQa / count).toFixed(1),
      returnFromQa: (sum.returnFromQa / count).toFixed(1),
      movedToReview: (sum.movedToReview / count).toFixed(1),
      returnFromReview: (sum.returnFromReview / count).toFixed(1),
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
      setActiveAction(null);
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

  return {
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
  };
}
