import React from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  LayoutGrid,
  RefreshCw,
  Server,
} from "lucide-react";
import { DatabaseRecord } from "../../models/databaseRecord.model.ts";
import { DatabaseMap } from "../../types/databaseRecord.type.ts";
import { CardView } from "./CardView.tsx";

interface QueryResultsSectionProps {
  viewMode: "cards" | "raw";
  onViewModeChange: (mode: "cards" | "raw") => void;
  copyIdOnly: boolean;
  onCopyIdOnlyChange: (copyIdOnly: boolean) => void;
  httpStatus: { code: number; text: string; success: boolean } | null;
  rawJsonResult: string | null;
  searchResult: DatabaseMap | DatabaseRecord[] | null;
  loading: boolean;
  copied: boolean;
  onCopyJson: () => void;
}

export const QueryResultsSection: React.FC<QueryResultsSectionProps> = ({
  viewMode,
  onViewModeChange,
  copyIdOnly,
  onCopyIdOnlyChange,
  httpStatus,
  rawJsonResult,
  searchResult,
  loading,
  copied,
  onCopyJson,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 font-sans">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center space-x-4">
          <h2 className="text-base font-bold text-slate-200">Result</h2>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => onViewModeChange("cards")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => onViewModeChange("raw")}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === "raw"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>RAW JSON</span>
            </button>
          </div>

          {viewMode === "cards" && (
            <label className="flex items-center space-x-2 text-xs font-mono text-slate-300 cursor-pointer select-none bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={copyIdOnly}
                onChange={(e) => onCopyIdOnlyChange(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Copy ID only</span>
            </label>
          )}
        </div>

        {httpStatus && (
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                httpStatus.success
                  ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
                  : "bg-rose-950/60 border-rose-800 text-rose-400"
              }`}
            >
              {httpStatus.success ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              <span>
                HTTP {httpStatus.code} ({httpStatus.text})
              </span>
            </span>

            {rawJsonResult && viewMode === "raw" && (
              <button
                onClick={onCopyJson}
                className="inline-flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[300px] overflow-x-auto">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
            <p className="text-slate-400 text-sm font-mono">
              Sending HTTP GET request to backend...
            </p>
          </div>
        ) : searchResult !== null ? (
          viewMode === "cards" ? (
            <CardView data={searchResult} copyIdOnly={copyIdOnly} />
          ) : (
            <pre className="font-mono text-xs text-emerald-400 leading-relaxed whitespace-pre-wrap break-words">
              {rawJsonResult}
            </pre>
          )
        ) : (
          <div className="py-20 text-center space-y-2">
            <Server className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-slate-500 text-sm font-mono">
              No query executed yet.
            </p>
            <p className="text-slate-600 text-xs">
              Select a table above to start searching.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
