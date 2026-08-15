import React, { useState } from "react";
import {
  Database,
  Download,
  Loader2,
  Sparkles,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Sliders,
  Eye,
} from "lucide-react";

interface MockGeneratorHeaderProps {
  types: string[];
  selectedType: string;
  amount: number;
  isLoadingTypes: boolean;
  isGenerating: boolean;
  hasGeneratedData: boolean;
  fileName?: string;
  onTypeChange: (type: string) => void;
  onAmountChange: (amount: number) => void;
  onGenerate: () => void;
  onDownload: () => void;
}

const PRESET_AMOUNTS = [1, 3, 5, 10, 50];

export const MockGeneratorHeader: React.FC<MockGeneratorHeaderProps> = ({
  types,
  selectedType,
  amount,
  isLoadingTypes,
  isGenerating,
  hasGeneratedData,
  fileName,
  onTypeChange,
  onAmountChange,
  onGenerate,
  onDownload,
}) => {
  const isCustomPreset = !PRESET_AMOUNTS.includes(amount);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(isCustomPreset);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const handleSelectChange = (value: string) => {
    if (value === "custom") {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      onAmountChange(Number(value));
    }
  };

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      {/* Top Row: Icon, Title, Badge & Guide Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-wide">
                Mock Data Generator
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                CSV Endpoint
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Generate, preview, and download simulated test datasets directly
              via the backend mock service.
            </p>
          </div>
        </div>

        {/* Guide Toggle Button */}
        <button
          type="button"
          onClick={() => setShowGuide((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer self-start md:self-center shrink-0 ${
            showGuide
              ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
              : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
          }`}
          title="Toggle mock generator guide"
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

      {/* Collapsible Workflow Guide Section */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>Mock Generator Workflow & Features</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Schema & Datasets */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <Sliders className="w-3.5 h-3.5 shrink-0" />
                  <span>Mock Schemas</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Select a predefined dataset template to simulate
                  production-like payloads.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Presets & Custom Counts (up to 10k)</span>
              </div>
            </div>

            {/* 2. Interactive Preview */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span>Table & Detail Drawer</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Filter generated rows instantly across all columns. Click any
                  record or use arrow keys (↑ / ↓) to open the side inspector
                  drawer.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-indigo-300 border-t border-slate-800/40">
                <span>Global search · Side drawer inspection</span>
              </div>
            </div>

            {/* 3. Export & Downloader */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                  <span>CSV File Export</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Download the generated schema as a clean, standardized CSV
                  file for local test automation or database seeding.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>1-Click direct CSV download</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Toolbar: Type Select, Row Count, Generate & Download */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mock Type Select */}
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 p-1 rounded-xl">
            <span className="text-slate-400 font-semibold text-[11px] pl-2">
              Type:
            </span>
            <select
              value={selectedType}
              disabled={isLoadingTypes || isGenerating || types.length === 0}
              onChange={(e) => onTypeChange(e.target.value)}
              className="bg-transparent text-white font-semibold text-xs pr-2 py-1 outline-none cursor-pointer border-none disabled:opacity-50 min-w-[130px]"
            >
              {isLoadingTypes ? (
                <option className="bg-[#0b111e]">Loading types...</option>
              ) : types.length === 0 ? (
                <option className="bg-[#0b111e]">No types found</option>
              ) : (
                types.map((t) => (
                  <option key={t} value={t} className="bg-[#0b111e] text-white">
                    {t}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Amount Selector */}
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 p-1 rounded-xl">
            <span className="text-slate-400 font-semibold text-[11px] pl-2">
              Rows:
            </span>
            <select
              value={isCustomMode ? "custom" : String(amount)}
              disabled={isGenerating}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="bg-transparent text-white font-semibold text-xs pr-2 py-1 outline-none cursor-pointer border-none disabled:opacity-50"
            >
              {PRESET_AMOUNTS.map((n) => (
                <option key={n} value={n} className="bg-[#0b111e] text-white">
                  {n} {n === 1 ? "Row" : "Rows"}
                </option>
              ))}
              <option value="custom" className="bg-[#0b111e] text-white">
                Custom...
              </option>
            </select>

            {isCustomMode && (
              <input
                type="number"
                min={1}
                max={10000}
                value={amount}
                disabled={isGenerating}
                placeholder="Count"
                autoFocus
                onChange={(e) =>
                  onAmountChange(Math.max(1, Number(e.target.value)))
                }
                className="w-20 bg-[#10192c] border border-blue-500/50 text-slate-200 rounded-lg px-2 py-0.5 text-xs font-mono font-semibold focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
              />
            )}
          </div>
        </div>

        {/* Action Buttons: Generate & Download */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || isLoadingTypes || !selectedType}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isGenerating ? "Generating..." : "Generate CSV"}</span>
          </button>

          {hasGeneratedData && (
            <button
              type="button"
              onClick={onDownload}
              title={`Download ${fileName || "mock data"}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
