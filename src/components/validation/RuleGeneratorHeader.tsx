import React, { ChangeEvent, useRef } from "react";
import {
  Code2,
  Download,
  FileCode,
  Loader2,
  Plus,
  Sparkles,
  Upload,
} from "lucide-react";

interface RuleGeneratorHeaderProps {
  onAddRule: () => void;
  onViewXml: () => void;
  onExportXml: () => void;
  onImportXml: (xmlContent: string, fileName: string) => void;
  isLoadingView: boolean;
  isLoadingExport: boolean;
  onLoadExample: () => void;
}

export const RuleGeneratorHeader: React.FC<RuleGeneratorHeaderProps> = ({
  onAddRule,
  onViewXml,
  onExportXml,
  onImportXml,
  isLoadingView,
  isLoadingExport,
  onLoadExample,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      if (content) {
        onImportXml(content, file.name);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const isBusy = isLoadingView || isLoadingExport;

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 backdrop-blur shadow-lg">
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
          <FileCode className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Validation Rule Creator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Backend Generator
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build, import, or edit XML validation schemas for batch processing.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xml,application/xml,text/xml"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Linke Seite: Import, Example & Add Rule */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0b111e] hover:bg-slate-800 text-blue-400 border border-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            title="Import an existing XML schema to edit"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import XML</span>
          </button>

          <button
            type="button"
            onClick={onLoadExample}
            disabled={isBusy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0b111e] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Example</span>
          </button>

          <button
            type="button"
            onClick={onAddRule}
            disabled={isBusy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0b111e] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rule</span>
          </button>
        </div>

        {/* Rechte Seite: View & Export Aktionen */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Button 1: Generiert XML und öffnet das Modal */}
          <button
            type="button"
            onClick={onViewXml}
            disabled={isBusy}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/60 rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingView ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
            ) : (
              <Code2 className="w-3.5 h-3.5 text-purple-400" />
            )}
            <span>{isLoadingView ? "Generating..." : "View XML Output"}</span>
          </button>

          {/* Button 2: Generiert XML und stößt direkten Download an */}
          <button
            type="button"
            onClick={onExportXml}
            disabled={isBusy}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingExport ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isLoadingExport ? "Exporting..." : "Export .xml"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
