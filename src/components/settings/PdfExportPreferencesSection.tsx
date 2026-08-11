import React from "react";
import { FileText } from "lucide-react";
import { useSettings } from "../../context/SettingsContext.tsx";

export const PdfExportPreferencesSection: React.FC = () => {
  const { isDraft, setIsDraft } = useSettings();

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-extrabold text-white">
            PDF Export Preferences
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
          Report Rendering
        </span>
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        <div className="space-y-0.5">
          <label className="font-bold text-slate-200 text-xs block">
            Draft Watermark Overlay
          </label>
          <p className="text-slate-400 text-[11px]">
            When enabled, generated PDF exports will contain a diagonal
            watermark background.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDraft(!isDraft)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isDraft ? "bg-cyan-600" : "bg-slate-700"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isDraft ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};
