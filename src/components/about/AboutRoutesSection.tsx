import React, { useState, useEffect, useMemo } from "react";
import { Route, RefreshCw, Search, RotateCcw, Filter, AlertTriangle } from "lucide-react";
import {routeService, RouteUsageMetric} from "../../services/network/route.service";

export const AboutRoutesSection: React.FC = () => {
    const [metrics, setMetrics] = useState<RouteUsageMetric[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [filterMode, setFilterMode] = useState<"ALL" | "UNUSED" | "ACTIVE">("ALL");

    const loadMetrics = async () => {
        setIsLoading(true);
        try {
            const data = await routeService.fetchAll();
            setMetrics(data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();
    }, []);

    const handleReset = async (httpMethod: string, pattern: string) => {
        await routeService.resetMetric(httpMethod, pattern);
        loadMetrics();
    };

    const filteredMetrics = useMemo(() => {
        return metrics.filter((m) => {
            const matchesSearch =
                m.pattern.toLowerCase().includes(search.toLowerCase()) ||
                m.controllerClass.toLowerCase().includes(search.toLowerCase()) ||
                m.httpMethod.toLowerCase().includes(search.toLowerCase());

            if (!matchesSearch) return false;

            if (filterMode === "UNUSED") return m.invocationCount === 0;
            if (filterMode === "ACTIVE") return m.invocationCount > 0;
            return true;
        });
    }, [metrics, search, filterMode]);

    const unusedCount = useMemo(
        () => metrics.filter((m) => m.invocationCount === 0).length,
        [metrics]
    );

    const getMethodBadgeClass = (method: string) => {
        switch (method.toUpperCase()) {
            case "GET":
                return "bg-blue-950/60 text-blue-300 border-blue-800/60";
            case "POST":
                return "bg-emerald-950/60 text-emerald-300 border-emerald-800/60";
            case "PUT":
                return "bg-amber-950/60 text-amber-300 border-amber-800/60";
            case "PATCH":
                return "bg-purple-950/60 text-purple-300 border-purple-800/60";
            case "DELETE":
                return "bg-rose-950/60 text-rose-300 border-rose-800/60";
            default:
                return "bg-slate-800 text-slate-300 border-slate-700";
        }
    };

    return (
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                    <Route className="w-4 h-4 text-cyan-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                        API Route Metrics & Dead-Code Tracker
                    </h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {metrics.length} Routes
          </span>
                    {unusedCount > 0 && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-300 border border-rose-800/60 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{unusedCount} Unused</span>
            </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={loadMetrics}
                    disabled={isLoading}
                    className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer disabled:opacity-50 self-start sm:self-center"
                    title="Refresh Route Metrics"
                >
                    <RefreshCw
                        className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-cyan-400" : ""}`}
                    />
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by pattern, controller, or HTTP method..."
                        className="w-full bg-[#0b111e] border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                </div>

                <div className="flex items-center gap-1.5 bg-[#0b111e] p-1 border border-slate-800 rounded-xl">
                    <Filter className="w-3 h-3 text-slate-500 ml-1.5 mr-0.5" />
                    {(["ALL", "ACTIVE", "UNUSED"] as const).map((mode) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => setFilterMode(mode)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                                filterMode === mode
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            {mode === "ALL" && "All"}
                            {mode === "ACTIVE" && "Active"}
                            {mode === "UNUSED" && `Unused (${unusedCount})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[420px] rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#0b111e] text-[11px] text-slate-400 font-semibold sticky top-0 border-b border-slate-800 z-10">
                        <tr>
                            <th className="p-3">Method</th>
                            <th className="p-3">Endpoint Pattern</th>
                            <th className="p-3">Controller / Handler</th>
                            <th className="p-3 text-right">Invocations</th>
                            <th className="p-3">Last Invoked</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-[#0d1527]/50 font-mono">
                        {filteredMetrics.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-6 text-center text-slate-500 font-sans">
                                    No routes match the current filter.
                                </td>
                            </tr>
                        ) : (
                            filteredMetrics.map((m) => (
                                <tr key={`${m.httpMethod}-${m.pattern}`} className="hover:bg-slate-800/30 transition">
                                    <td className="p-3">
                    <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getMethodBadgeClass(
                            m.httpMethod
                        )}`}
                    >
                      {m.httpMethod}
                    </span>
                                    </td>
                                    <td className="p-3 font-semibold text-slate-200">{m.pattern}</td>
                                    <td className="p-3 text-[11px] text-slate-400">
                                        <span className="text-slate-300">{m.controllerClass}</span>
                                        <span className="text-slate-600">#</span>
                                        <span className="text-slate-400">{m.controllerMethod}</span>
                                    </td>
                                    <td className="p-3 text-right font-bold">
                    <span
                        className={
                            m.invocationCount === 0
                                ? "text-rose-400"
                                : "text-emerald-400"
                        }
                    >
                      {m.invocationCount}
                    </span>
                                    </td>
                                    <td className="p-3 text-[11px] text-slate-500">
                                        {m.lastInvokedAt
                                            ? new Date(m.lastInvokedAt).toLocaleString("de-DE")
                                            : "—"}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleReset(m.httpMethod, m.pattern)}
                                            className="p-1 rounded bg-[#0b111e] hover:bg-slate-800 text-slate-500 hover:text-rose-400 border border-slate-800 transition cursor-pointer"
                                            title="Reset counter"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};