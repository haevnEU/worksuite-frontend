import React, { useState } from "react";
import {
  Database,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  TableProperties,
} from "lucide-react";

export const DatabaseQueryHeader: React.FC = () => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      {/* Top Row: Icon, Title, Badge & Guide Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0 mt-1 md:mt-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Backend Table Query
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Direct DB Access
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Select a table and search field to query entries directly via{" "}
              <code className="text-blue-300 font-mono bg-[#0b111e] px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                GET
                /api/v1/database?searchParam=&#123;key/id&#125;&value=&#123;value&#125;
              </code>
            </p>
          </div>
        </div>

        {/* Guide Toggle Button */}
        <button
          type="button"
          onClick={() => setShowGuide((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer self-start md:self-center shrink-0 ${
            showGuide
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
              : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          title="Toggle database query guide"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Guide</span>
          {showGuide ? (
            <ChevronUp className="w-3 h-3 ml-0.5" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-0.5" />
          )}
        </button>
      </div>

      {/* Collapsible Guide Section */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Table Query & Filter Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Target & Fields */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <TableProperties className="w-3.5 h-3.5 shrink-0" />
                  <span>Table & Column Lookup</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Choose the target schema table and match entries by primary
                  key, UUID, external ID, or column attribute.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Param: searchParam=user_id</span>
              </div>
            </div>

            {/* 2. Value Querying */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                  <Search className="w-3.5 h-3.5 shrink-0" />
                  <span>Search Criteria</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pass exact values or pattern fragments. Results are serialized
                  and mapped directly into the result grid.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-cyan-300 border-t border-slate-800/40">
                <span>Value: value=USR-98412</span>
              </div>
            </div>

            {/* 3. Safe Execution */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Read-Only & Safety</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Queries run in a read-only transaction with predefined
                  pagination and result-size safeguards.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>Read-Only Transaction</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
