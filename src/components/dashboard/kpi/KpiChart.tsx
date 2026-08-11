import React from "react";
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
import { formatKpiDayShort } from "../../../utils/data.util";
import { formatKpiDay } from "../../../utils/data.util.ts";

interface KpiChartProps {
  data: any[];
  colors: Record<string, string>;
  enabledKpis: any;
  chartType: string;
}

export const KpiChart: React.FC<KpiChartProps> = ({
  data,
  colors,
  enabledKpis,
  chartType,
}) => {
  if (!data || !data.length) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500 text-xs font-semibold">
        No KPI data available.
      </div>
    );
  }

  const showBars = chartType === "bar" || chartType === "both";
  const showLines = chartType === "line" || chartType === "both";
  const barOpacity = chartType === "both" ? 0.7 : 0.85;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
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
          tickFormatter={(value) => formatKpiDayShort(value)}
        />

        <YAxis
          stroke="#94a3b8"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />

        <Tooltip
          labelFormatter={(label) => formatKpiDay(label)}
          contentStyle={{
            backgroundColor: "#0f172a",
            borderColor: "#334155",
            borderRadius: "0.75rem",
            fontSize: "12px",
            color: "#fff",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
          }}
          itemStyle={{ color: "#fff", padding: "2px 0" }}
        />

        {showBars && enabledKpis?.movedQa && (
          <Bar
            dataKey="movedToQa"
            name="Moved to QA"
            fill={colors.movedToQa}
            radius={[4, 4, 0, 0]}
            opacity={barOpacity}
          />
        )}
        {showBars && enabledKpis?.fromQa && (
          <Bar
            dataKey="returnFromQa"
            name="Returned from QA"
            fill={colors.returnFromQa}
            radius={[4, 4, 0, 0]}
            opacity={barOpacity}
          />
        )}
        {showBars && enabledKpis?.movedReview && (
          <Bar
            dataKey="movedToReview"
            name="Moved to Review"
            fill={colors.movedToReview}
            radius={[4, 4, 0, 0]}
            opacity={barOpacity}
          />
        )}
        {showBars && enabledKpis?.fromReview && (
          <Bar
            dataKey="returnFromReview"
            name="Returned from Review"
            fill={colors.returnFromReview}
            radius={[4, 4, 0, 0]}
            opacity={barOpacity}
          />
        )}

        {showLines && enabledKpis?.movedQa && (
          <Line
            type="monotone"
            dataKey="movedToQa"
            name={chartType === "both" ? "Moved to QA (Trend)" : "Moved to QA"}
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
  );
};
