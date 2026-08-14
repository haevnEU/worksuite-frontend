import React, { useState } from "react";
import { Database, Download, Loader2, Sparkles } from "lucide-react";

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

  const handleSelectChange = (value: string) => {
    if (value === "custom") {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
      onAmountChange(Number(value));
    }
  };

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 backdrop-blur shadow-lg">
      {/* Title & Info */}
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
            Generate and inspect simulated test datasets directly via backend
            mock service.
          </p>
        </div>
      </div>

      {/* Form Controls */}
      <div className="flex flex-wrap items-center gap-3 self-start lg:self-center shrink-0">
        {/* Type Select */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Mock Type
          </label>
          <select
            value={selectedType}
            disabled={isLoadingTypes || isGenerating || types.length === 0}
            onChange={(e) => onTypeChange(e.target.value)}
            className="bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50 min-w-[140px]"
          >
            {isLoadingTypes ? (
              <option>Loading types...</option>
            ) : types.length === 0 ? (
              <option>No types found</option>
            ) : (
              types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Amount Selector (Presets & Custom) */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Amount
          </label>
          <div className="flex items-center gap-2">
            <select
              value={isCustomMode ? "custom" : String(amount)}
              disabled={isGenerating}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
            >
              {PRESET_AMOUNTS.map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Row" : "Rows"}
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>

            {/* Custom Number Input */}
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
                className="w-24 bg-[#0b111e] border border-blue-500/50 text-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-semibold focus:outline-none focus:border-blue-500 transition disabled:opacity-50"
              />
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col justify-end self-end">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || isLoadingTypes || !selectedType}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition shadow-lg shadow-blue-600/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isGenerating ? "Generating..." : "Generate CSV"}</span>
          </button>
        </div>

        {/* Download CSV Button */}
        {hasGeneratedData && (
          <div className="flex flex-col justify-end self-end">
            <button
              type="button"
              onClick={onDownload}
              title={`Download ${fileName}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
