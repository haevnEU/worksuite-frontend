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
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg">
      {/* Linke Seite: Icon, Titel, Badge & Subtitle */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-wide">
              {activeMeeting
                ? activeMeeting.title
                : "Team Meeting & Tuesday Preparation"}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Weekly
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Weekly sync, roadmap review, and team task alignment
          </p>
        </div>
      </div>

      {/* Rechte Seite: Info Pill & Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
        {/* Date / Status Pill */}
        {activeMeeting?.createdAt && (
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-3.5 py-2 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Created:</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold px-2 py-0.5 rounded-full text-[11px]">
              {activeMeeting.createdAt.split("T")[0]}
            </span>
          </div>
        )}

        {/* Generate Week Button */}
        <button
          type="button"
          disabled={isGenerating || isLoading}
          onClick={onGenerateNextWeek}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`}
          />
          <span>{isGenerating ? "Generating..." : "Generate Week"}</span>
        </button>

        {/* Export PDF Pill Button */}
        <button
          type="button"
          disabled={!activeMeeting || isExporting || isLoading}
          onClick={onExportPdf}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Download
            className={`w-3.5 h-3.5 text-blue-400 ${
              isExporting ? "animate-bounce" : ""
            }`}
          />
          <span>Export PDF</span>
        </button>
      </div>
    </div>
  );
};
