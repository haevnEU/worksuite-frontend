import React from "react";
import { Calendar, Download, RefreshCw } from "lucide-react";
import { WeeklyMeetingDTO } from "../../models/weeklyMeeting.model.ts";

interface TeamMeetingHeaderProps {
  activeMeeting: WeeklyMeetingDTO | null;
  isGenerating: boolean;
  isExporting: boolean;
  isLoading: boolean;
  onGenerateNextWeek: () => void;
  onExportPdf: () => void;
}

export const TeamMeetingHeader: React.FC<TeamMeetingHeaderProps> = ({
  activeMeeting,
  isGenerating,
  isExporting,
  isLoading,
  onGenerateNextWeek,
  onExportPdf,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 font-sans">
      <div className="flex items-center space-x-3.5">
        <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
          <Calendar className="w-5.5 h-5.5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {activeMeeting
              ? activeMeeting.title
              : "Team Meeting & Tuesday Preparation"}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeMeeting
              ? `Created on ${activeMeeting.createdAt.split("T")[0]}`
              : "No active meeting loaded"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2.5 shrink-0">
        <button
          type="button"
          disabled={isGenerating || isLoading}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-colors text-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          onClick={onGenerateNextWeek}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-blue-400 ${
              isGenerating ? "animate-spin" : ""
            }`}
          />
          <span>{isGenerating ? "Generating..." : "Generate Week"}</span>
        </button>

        <button
          type="button"
          disabled={!activeMeeting || isExporting || isLoading}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-colors text-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          onClick={onExportPdf}
        >
          <Download
            className={`w-3.5 h-3.5 text-slate-400 ${
              isExporting ? "animate-bounce" : ""
            }`}
          />
          <span>Export PDF</span>
        </button>
      </div>
    </div>
  );
};
