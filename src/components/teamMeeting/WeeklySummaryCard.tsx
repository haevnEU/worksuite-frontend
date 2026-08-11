import React from "react";
import { Clock, Save, Sparkles } from "lucide-react";
import { WeeklyMeetingDTO } from "../../models/weeklyMeeting.model.ts";

interface WeeklySummaryCardProps {
  activeMeeting: WeeklyMeetingDTO | null;
  weeklySummaryInput: string;
  onWeeklySummaryInputChange: (value: string) => void;
  onSaveWeeklySummary: (e: React.FormEvent) => void;
}

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({
  activeMeeting,
  weeklySummaryInput,
  onWeeklySummaryInputChange,
  onSaveWeeklySummary,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Weekly Overall Summary
          </h2>
        </div>
        {activeMeeting && (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/60 text-blue-400 border border-blue-800/60 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {activeMeeting.createdAt.split("T")[0]}
          </span>
        )}
      </div>

      <form onSubmit={onSaveWeeklySummary} className="space-y-3">
        <textarea
          rows={3}
          value={weeklySummaryInput}
          placeholder="Enter high-level summary and key topics for this week..."
          className="w-full bg-slate-800/50 border border-slate-700/60 text-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs resize-none"
          onChange={(e) => onWeeklySummaryInputChange(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!activeMeeting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </form>
    </div>
  );
};
