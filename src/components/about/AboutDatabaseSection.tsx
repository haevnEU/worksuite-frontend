import React from "react";
import { Database, HardDrive, RefreshCw } from "lucide-react";
import { DatabaseInfo } from "../../models/about.model.ts";

interface AboutDatabaseSectionProps {
  postgresInfo?: DatabaseInfo;
  mongoInfo?: DatabaseInfo;
  isLoading: boolean;
  onRefresh: () => void;
}

export const AboutDatabaseSection: React.FC<AboutDatabaseSectionProps> = ({
  postgresInfo,
  mongoInfo,
  isLoading,
  onRefresh,
}) => {
  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <Database className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Database Connectivity & Connection Pools
          </h2>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="p-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer disabled:opacity-50"
          title="Refresh database telemetry"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-400" : ""}`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* PostgreSQL Card */}
        <div className="p-4 bg-[#0b111e] rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-slate-200">
                {postgresInfo?.databaseProductName || "PostgreSQL (RDBMS)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {postgresInfo?.pingMs !== undefined &&
                postgresInfo.pingMs >= 0 && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {postgresInfo.pingMs} ms
                  </span>
                )}
              <span
                className={`font-mono text-[11px] px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${
                  postgresInfo?.status === "UP"
                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
                    : "bg-rose-950/60 text-rose-400 border-rose-800/60"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    postgresInfo?.status === "UP"
                      ? "bg-emerald-400"
                      : "bg-rose-400"
                  }`}
                />
                <span>{postgresInfo?.status || "UNKNOWN"}</span>
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Version:</span>
              <span className="font-mono text-slate-300 truncate max-w-[280px]">
                {postgresInfo?.databaseProductVersion || "—"}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>HikariCP Pool:</span>
              <span className="font-mono text-blue-300">
                {postgresInfo?.activeConnections ?? 0} active /{" "}
                {postgresInfo?.idleConnections ?? 0} idle (
                {postgresInfo?.totalConnections ?? 0} total)
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Connection URL:</span>
              <span
                className="font-mono text-slate-400 truncate max-w-[280px]"
                title={postgresInfo?.url}
              >
                {postgresInfo?.url || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* MongoDB Card */}
        <div className="p-4 bg-[#0b111e] rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200">
                {mongoInfo?.databaseProductName || "MongoDB (Document Store)"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {mongoInfo?.pingMs !== undefined && mongoInfo.pingMs >= 0 && (
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {mongoInfo.pingMs} ms
                </span>
              )}
              <span
                className={`font-mono text-[11px] px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${
                  mongoInfo?.status === "UP"
                    ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
                    : "bg-rose-950/60 text-rose-400 border-rose-800/60"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    mongoInfo?.status === "UP"
                      ? "bg-emerald-400"
                      : "bg-rose-400"
                  }`}
                />
                <span>{mongoInfo?.status || "UNKNOWN"}</span>
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Version:</span>
              <span className="font-mono text-slate-300">
                {mongoInfo?.databaseProductVersion || "—"}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Target Database:</span>
              <span className="font-mono text-emerald-300">
                {mongoInfo?.url || "worksuite"}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Driver:</span>
              <span className="font-mono text-slate-400">
                {mongoInfo?.driverName || "MongoDB Java Sync Driver"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
